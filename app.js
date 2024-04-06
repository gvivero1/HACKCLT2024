const express = require('express');

const app = express();

const port = 8000;
const host = 'localhost';

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});

