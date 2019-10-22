const express = require('express');
const businessCardParser = require('../controllers/businessCardParser');

const router = express.Router();

// This endpoint parses a business card OCR text string and returns an object that has a name,
// emailAddress, and phoneNumber key-value pair. The request should have the following body:
// { inputText: 'Parsable Business Card OCR Text Here' }
router.post('/v1/parseOcrText', (req, res) => {
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
router.get('/', (req, res) => {
  res.status(200).render('index', { title: 'OCR Text Parser' });
});

module.exports = router;
