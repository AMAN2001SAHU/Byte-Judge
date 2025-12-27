import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { error } from 'console';
import { exec } from 'child_process';
import { exitCode, stderr, stdout } from 'process';

const app = express();
const PORT = 8000;

// app.use(express.json());
app.use(bodyParser.json({ limit: '1mb' }));

app.post('/api/run', async (req, res) => {
  const { code, language, stdin } = req.body as {
    code: string;
    language: string;
    stdin?: string;
  };

  const id = Date.now().toString();
  const dir = path.join(__dirname, '..', 'runs', id);
  fs.mkdirSync(dir, { recursive: true });

  try {
    let fileName: string;
    let cmd: string;

    if (language == 'javascript') {
      fileName = 'main.js';
      fs.writeFileSync(path.join(dir, fileName), code);

      cmd = `node ${fileName}`;
    } else if (language == 'python') {
      fileName = 'main.py';
      fs.writeFileSync(path.join(dir, fileName), code);
      cmd = `python3 ${fileName}`;
    } else if (language == 'cpp') {
      fileName = 'main.cpp';
      fs.writeFileSync(path.join(dir, fileName), code);
      cmd = `g++ ${fileName} -02 -std=c++17 -o main.exe && ./main.exe`;
    } else {
      return res.status(400).json({ error: 'Unsupported Language' });
    }

    const child = exec(
      cmd,
      { cwd: dir, timeout: 5000, maxBuffer: 10 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err) {
          const exitCode = (err as any).code ?? 1;
          res.json({ exitCode, stdout, stderr: stderr || err.message });
        } else {
          res.json({ exitCode: 0, stdout, stderr });
        }
        // cleanup optionally
        fs.rmSync(dir, { recursive: true, force: true });
      }
    );

    if (stdin) {
      child.stdin?.write(stdin);
      child.stdin?.end();
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});

app.get('/', (req, res) => {
  //   res.status(200).json('Everything working fine');
  res.send('API working fine');
});

app.listen(PORT, () => {
  console.log(`Starting the API server on PORT ${PORT}`);
});
