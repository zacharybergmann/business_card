require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const ContactInfo = require('../models/ContactInfo');

const PORT = process.env.PORT || 8000;
const app = express();

app.listen(PORT, (err) => {
  if (!err) {
    process.stdout.write(`Server is running on port ${PORT}!\n`);
  }
});

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(`${process.cwd()}/app/public`));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(morgan('dev'));
app.set('views', './app/views');
app.set('view engine', 'pug');

app.post('/parseOcrText', (req, res) => {
  // go ahead and parse into a ContactInfo object
  console.log(req.body);
  const aContactInfo = new ContactInfo('Zachary B', '1231231231', 'tests@test.com');
  res.statusCode = 200;
  // res.setHeader('Content-Type', 'application/json');
  // if valid
    // sent valid response and data back in new form
  // else
    // send invalid response and error message encountered
  res.send({ name: aContactInfo.getName(), emailAddress: aContactInfo.emailAddress, phoneNumber: aContactInfo.phoneNumber });
});

app.get('/', (req, res) => {
  res.render('index', { title: 'OCR Text Parser', message: 'Hello there!', outputText: 'Testing output text here' });
});
