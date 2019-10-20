require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const businessCardParser = require('../controllers/businessCardParser');

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
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(morgan('dev'));
app.set('views', './app/views');
app.set('view engine', 'pug');

app.post('/parseOcrText', (req, res) => {
  try {
    if (Object.prototype.hasOwnProperty.call(req.body, 'inputText')) {
      const aContactInfo = businessCardParser.getContactInfo(req.body.inputText);
      res.statusCode = 200;
      res.send({
        name: aContactInfo.getName(),
        emailAddress: aContactInfo.emailAddress,
        phoneNumber: aContactInfo.phoneNumber,
      });
    } else {
      throw Error('Invalid request format');
    }
  } catch (err) {
    res.status = 400;
    res.send({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.render('index', { title: 'OCR Text Parser', message: 'Hello there!', outputText: 'Testing output text here' });
});
