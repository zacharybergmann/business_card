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
    const { name, email, phone } = businessCardParser.classifyTextArr(sentences);
    return new ContactInfo(
      name[0] || '',
      businessCardParser.cleanPhone(phone[0] || ''),
      businessCardParser.cleanEmail(email[0] || ''),
    );
  },

  classifyTextArr: (sentences) => {
    const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/gm;
    // Phone number regex found at https://zapier.com/blog/extract-links-email-phone-regex/
    const phoneRegex = /(?:(?:\+?([1-9]|[0-9][0-9]|[0-9][0-9][0-9])\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([0-9][1-9]|[0-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/g;
    // Email address regex follows RFC 5322 Official Standard found at https://emailregex.com/
    // eslint-disable-next-line no-control-regex
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
    const classifiedData = {
      name: businessCardParser.filterByRegex(sentences, nameRegex),
      email: businessCardParser.filterByRegex(sentences, emailRegex),
      phone: businessCardParser.filterByRegex(sentences, phoneRegex),
    };
    // filter results based on whitelist/blacklist for field
    classifiedData.phone = businessCardParser.applyBlacklist(
      [].concat(faxList, statesList, roadsList),
      classifiedData.phone,
    );
    classifiedData.name = businessCardParser.applyBlacklist(
      [].concat(companiesList, jobTitlesList),
      classifiedData.name,
    );

    const phoneWhiteResults = businessCardParser.applyWhitelist(
      phoneList,
      classifiedData.phone,
    );

    if (phoneWhiteResults.length > 0) {
      classifiedData.phone = phoneWhiteResults;
    }
    return classifiedData;
  },

  /**
   * The filterByRegex method takes an array of sentence strings and returns only the sentences
   * that match a specific regex
   * @param {Array} sentences An array of strings that should be tested
   * @param {Object} regex A regex pattern to apply on strings
   * @returns An array of sentences that did match the regex pattern
   */
  filterByRegex: (sentences, regex) => sentences.filter((str) => (new RegExp(regex)).test(str)),

  /**
   * The cleanEmail method captures only the email address from a string and returns it
   * @param {String} str A string that should have an email address within it
   * @returns {String} A string with all only the email address in it
   */
  cleanEmail: (str) => {
    // grab email address only, drop anything else on that line
    const emailCleanRegex = /\S+@\S+/;
    const emailMatches = str.match(emailCleanRegex);
    if (emailMatches === null) {
      return '';
    }
    return emailMatches[0];
  },

  /**
   * The cleanPhone method removes all characters that are not numbers
   * from the argument string
   * @param {String} str A string that should have a phone number within it
   * @returns {String} A string with all non-numerics and spaces removed,
   * this should not be a string of only numbers
   */
  // eslint-disable-next-line arrow-body-style
  cleanPhone: (str) => {
    return str.replace(/[^0-9]/g, '');
  },

  /**
   * The applyBlacklist method takes a blacklist array of strings and an array of sentences and
   * returns only the sentences that do not match any of the strings in the blacklist
   * @param {Array} blacklist An array of words that should not be included in a sentence
   * @param {Array} sentences An array of sentences (strings) that should be tested
   * @returns {Array} A filtered array of sentences that never matched any of the words in the
   * blacklist
   */
  // eslint-disable-next-line arrow-body-style
  applyBlacklist: (blacklist, sentences) => {
    return sentences.filter((sent) => {
      let isValid = true;
      blacklist.forEach((item) => {
        if (sent.toLowerCase().includes(item)) {
          isValid = false;
        }
      });
      return isValid;
    });
  },

  /**
   * The applyWhitelist method takes a whitelist array of strings and an array of sentences and
   * returns only the sentences that match any of the strings in the whitelist
   * @param {Array} whitelist An array of words that should be included in a sentence
   * @param {Array} sentences An array of sentences (strings) that should be tested
   * @returns {Array} A filtered array of sentences that ever matched a word in the whitelist
   */
  // eslint-disable-next-line arrow-body-style
  applyWhitelist: (whitelist, sentences) => {
    return sentences.filter((sent) => {
      let isMatch = false;
      whitelist.forEach((item) => {
        if (sent.toLowerCase().includes(item)) {
          isMatch = true;
        }
      });
      return isMatch;
    });
  },
};

module.exports = businessCardParser;
