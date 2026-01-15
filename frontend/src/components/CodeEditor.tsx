import Editor from "@monaco-editor/react";
import { forwardRef, useImperativeHandle, useState } from "react";

type Props = {
  defaultLang?: "javascript" | "python" | "cpp";
};

export type CodeEditorHandle = {
  getCode: () => string;
  getLanguage: () => string;
};

const starterCode: Record<string, string> = {
  javascript: `// JavaScript (Node.js)
  const fs = require("fs");

  function solve(input = "") {
    const nums = input.trim().split(/\\s+/).map(Number);
    console.log(nums.join(","));
  }

  const input = fs.readFileSync(0, "utf-8");
  solve(input);
  `,

  python: `# Python 3
import sys

data = sys.stdin.read().strip()
print(data)
  `,

  cpp: `#include <iostream>
  #include <string>

  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      string input, line;
      while (getline(cin, line)) {
          input += line + "\\n";
      }

      cout << input;
      return 0;
  }
  `,
};

const CodeEditor = forwardRef<CodeEditorHandle, Props>(
  ({ defaultLang = "cpp" }, ref) => {
    const [language, setLanguage] = useState(defaultLang);
    const [code, setCode] = useState(starterCode[defaultLang]);

    useImperativeHandle(ref, () => ({
      getCode: () => code,
      getLanguage: () => language,
    }));

    return (
      <div className="flex flex-col h-full gap-4 m-2">
        <div className="flex items-center gap-3">
          <select
            className="border rounded px-2 py-1 bg-background text-foreground"
            value={language}
            onChange={(e) => {
              const next = e.target.value as "javascript" | "python" | "cpp";
              setLanguage(next);
              setCode(starterCode[next]);
            }}
          >
            <option value="javascript">Javascript (Node)</option>
            <option value="python">Python</option>
            <option value="cpp">C++ (g++)</option>
          </select>
        </div>

        <div className="flex gap-4 flex-1 min-h-[360px]">
          {/* Monaco Editor */}
          <div className="flex-1 border rounded overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={code}
              theme="vs-dark"
              onChange={(v) => v !== undefined && setCode(v)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default CodeEditor;
