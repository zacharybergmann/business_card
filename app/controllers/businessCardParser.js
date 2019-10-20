/**
 * The businessCard object holds methods related to parsing business card OCR text
 */

const companiesList = require('../../resources/companies.json');
const faxList = require('../../resources/fax.json');
const statesList = require('../../resources/states.json');
// Roads list initialized from https://pe.usps.com/text/pub28/28apc_002.htm
const roadsList = require('../../resources/roads.json');
const phoneList = require('../../resources/phone.json');
// Job titles list initialized from
// https://github.com/Brunty/faker-buzzword-job-titles/blob/develop/src/BuzzwordJobProvider.php
const jobTitlesList = require('../../resources/jobTitles.json');
const ContactInfo = require('../models/ContactInfo');

/**
 * This object stores various methods that will be used on OCR text to extract
 * a name, phone number, and email address and then create an instance of the ContactInfo class
 */
const businessCardParser = {
  /**
   * The getContactInfo function takes non-homogeneous business card text and parses specific
   * extracted fields into a contactInfo object
   * @param {String} doc A sequence of characters that should contain a name, phoneNumber,
   * and emailAddress
   * @returns {ContactInfo} A ContactInfo instance that contains the desired information
   */
  getContactInfo: (doc) => {
    const sentences = doc.split('\n');
    const { name, emailAddress, phoneNumber } = businessCardParser.classifyTextArr(sentences);
    return new ContactInfo(
      name[0],
      businessCardParser.cleanPhoneNumber(phoneNumber[0]),
      businessCardParser.cleanEmailAddress(emailAddress[0]),
    );
  },

  classifyTextArr: (sentences) => {
    const classifiedData = {
      name: businessCardParser.regexMatchName(sentences),
      emailAddress: businessCardParser.regexMatchEmailAddress(sentences),
      phoneNumber: businessCardParser.regexMatchPhoneNumber(sentences),
    };
    // filter results based on whitelist/blacklist for field
    classifiedData.phoneNumber = businessCardParser.applyBlackList(
      [].concat(faxList, statesList, roadsList),
      classifiedData.phoneNumber,
    );
    classifiedData.name = businessCardParser.applyBlackList(
      [].concat(companiesList, jobTitlesList),
      classifiedData.name,
    );

    const phoneNumberWhiteResults = businessCardParser.applyWhiteList(
      phoneList,
      classifiedData.phoneNumber,
    );

    if (phoneNumberWhiteResults.length > 0) {
      classifiedData.phoneNumber = phoneNumberWhiteResults;
    }
    return classifiedData;
  },

  // could generalize and use new regexp to handle a regex and a string match the same way through
  // same function should also handle zip code regex removal

  regexMatchName: (sentences) => {
    const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/gm;
    return sentences.filter((sent) => (new RegExp(nameRegex)).test(sent));
  },
  regexMatchPhoneNumber: (sentences) => {
    const phoneNumberRegex = /(?:(?:\+?([1-9]|[0-9][0-9]|[0-9][0-9][0-9])\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([0-9][1-9]|[0-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/g;
    return sentences.filter((sent) => (new RegExp(phoneNumberRegex)).test(sent));
  },
  regexMatchEmailAddress: (sentences) => {
    // eslint-disable-next-line no-control-regex
    const emailAddressRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
    return sentences.filter((sent) => (new RegExp(emailAddressRegex)).test(sent));
  },

  cleanEmailAddress: (str) => {
    // get capture email, drop anything else
    const emailCleanRegex = /\S+@\S+/;
    // should probably error handle no match
    return str.match(emailCleanRegex)[0];
  },

  // eslint-disable-next-line arrow-body-style
  cleanPhoneNumber: (str) => {
    return str.replace(/[^0-9]/g, '');
  },

  // eslint-disable-next-line arrow-body-style
  applyBlackList: (blackList, sentences) => {
    return sentences.filter((sent) => {
      let isValid = true;
      blackList.forEach((item) => {
        if (sent.toLowerCase().includes(item)) {
          isValid = false;
        }
      });
      return isValid;
    });
  },

  // eslint-disable-next-line arrow-body-style
  applyWhiteList: (whiteList, sentences) => {
    return sentences.filter((sent) => {
      let isMatch = false;
      whiteList.forEach((item) => {
        if (sent.toLowerCase().includes(item)) {
          isMatch = true;
        }
      });
      return isMatch;
    });
  },
};

module.exports = businessCardParser;
