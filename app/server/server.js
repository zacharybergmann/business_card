require('dotenv').config();

const path = require('path');
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;
const app = express();

app.use(morgan('dev'));
app.set('views', './app/views');
app.set('view engine', 'pug');
app.use(express.static(`${process.cwd()}/app/public`));

app.get('/', (req, res) => {
  res.render('index', { title: 'OCR Text Parser', message: 'Hello there!' });
});

app.listen(PORT, (err) => {
  if (!err) {
    process.stdout.write(`Server is running on port ${PORT}!\n`);
  }
});
