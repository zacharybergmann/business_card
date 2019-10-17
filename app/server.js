require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, (err) => {
  if (!err) {
    process.stdout.write(`Server is running on port ${PORT}!\n`);
  }
});

app.use(morgan('dev'));
