import express from 'express';

const app = express();
const PORT = 8000;

app.use(express.json());

app.get('/', (req, res) => {
  //   res.status(200).json('Everything working fine');
  res.send('API working fine');
});

app.listen(PORT, () => {
  console.log(`Starting the API server on PORT ${PORT}`);
});
