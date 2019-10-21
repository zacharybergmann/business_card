const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const businessCardParser = require('../controllers/businessCardParser');

const PORT = 8000;
const app = express();

// start the server listening on PORT
app.listen(PORT, (err) => {
  if (!err) {
    process.stdout.write(`Server is running on port ${PORT}!\n`);
  }
  // will exit back to CLI here if unable to start server
});

// parse the body of all incoming requests for easier access
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// set location where static assets on the server can be requested from
app.use(express.static(`${process.cwd()}/app/public`));
// set allowed headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// middleware to log requests with response codes
app.use(morgan('dev'));
// set location to views for server and configure server to use Pug template view engine
app.set('views', './app/views');
app.set('view engine', 'pug');

// This endpoint parses a business card OCR text string and returns an object that has a name,
// emailAddress, and phoneNumber key-value pair. The request should have the following body:
// { inputText: 'Parsable Business Card OCR Text Here' }
app.post('/parseOcrText', (req, res) => {
  try {
    if (Object.prototype.hasOwnProperty.call(req.body, 'inputText')) {
      const aContactInfo = businessCardParser.getContactInfo(req.body.inputText);
      res.status(200).send({
        name: aContactInfo.getName(),
        email: aContactInfo.emailAddress,
        phone: aContactInfo.phoneNumber,
      });
    } else {
      throw Error('Invalid request format');
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// This endpoint renders and serves the web page
app.get('/', (req, res) => {
  res.status(200).render('index', { title: 'OCR Text Parser' });
});

module.exports = app;
