/**
 * The businessCard object holds methods related to parsing business card OCR text
 */
const config = require('../../config');
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
    const { name, phone, email } = businessCardParser.classifyTextArr(sentences);
    return new ContactInfo(
      name,
      phone,
      email,
    );
  },

  // eslint-disable-next-line arrow-body-style
  classifyTextArr: (sentences) => {
    // iterate through fields in the configuration
    return Object.keys(config).reduce((agg, field) => {
      // first apply regex, then blacklist, then whitelist
      const regexResult = businessCardParser.filterByRegex(sentences, config[field].regex);
      const blacklistResult = businessCardParser.applyBlacklist(
        config[field].blacklist,
        regexResult,
      );
      const whitelistResult = businessCardParser.applyWhitelist(
        config[field].whitelist,
        blacklistResult,
      );
      // if no whitelist matches, fall back to sentences that passed blacklist test
      let cleanResult;
      if (whitelistResult.length > 0) {
        cleanResult = businessCardParser.cleanString(whitelistResult[0], config[field].clean);
      } else {
        cleanResult = businessCardParser.cleanString(blacklistResult[0], config[field].clean);
      }
      return {
        ...agg,
        [field]: cleanResult,
      };
    }, {});
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
   * The cleanString method captures only a specific regex match or matches and returns
   * the concatenated version of those matches
   * @param {String} str A string to search for matches in
   * @param {Object} cleanRegex A regex to match the string against
   * @returns {String} A string of the concatenated matches
   */
  cleanString: (str, cleanRegex) => {
    const matches = str.match(cleanRegex);
    if (matches === null) {
      return '';
    }
    return matches.join('');
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
    // filter the array of sentences
    return sentences.filter((sent) => {
      // default sentence as not having failed so far (isValid)
      let isValid = true;
      // use for loop to allow early breakout
      // iterate through words in blacklist
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < blacklist.length; i++) {
        if (sent.toLowerCase().includes(blacklist[i])) {
          // if a word in blacklist is found in sentence, ensure it is not put into output array
          // and break loop
          isValid = false;
          break;
        }
      }
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
    // filter the array of sentences
    return sentences.filter((sent) => {
      // default sentence as not having a match yet
      let isMatch = false;
      // use for loop to allow early breakout
      // iterate through words in whitelist
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < whitelist.length; i++) {
        if (sent.toLowerCase().includes(whitelist[i])) {
          // if a word in whitelist is found in sentence, ensure it is put into output array
          // and break loop
          isMatch = true;
          break;
        }
      }
      return isMatch;
    });
  },
};

module.exports = businessCardParser;
