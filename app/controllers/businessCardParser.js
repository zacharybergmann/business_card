/**
 * The businessCard object holds methods related to parsing business card OCR text
 */
const config = require('./businessCardParserConfig');
const ContactInfo = require('../models/ContactInfo');

/**
 * This object stores various methods that will be used on OCR text to extract
 * a name, phone number, and email address and then create an instance of the ContactInfo class
 */
const businessCardParser = {
  /**
   * The getContactInfo function takes non-homogeneous business card text and parses specific
   * extracted fields into a contactInfo object
   * @param {String} doc A sequence of characters that should contain a name, phone, and email
   * @returns {ContactInfo} A ContactInfo instance that contains the desired information
   */
  getContactInfo: (doc) => {
    const sentences = doc.split('\n');
    const { name, phone, email } = businessCardParser.classifySentences(sentences);
    return new ContactInfo(name, phone, email);
  },

  /**
   * The classifySentences method takes an array of sentences and applies various filters and regex
   * to match a field to its classified value
   * @param {Array} sentences An array of lines that could contain field information
   * @returns {Object} An object of field-value pairs from classifying the sentences
   */
  // eslint-disable-next-line arrow-body-style
  classifySentences: (sentences) => {
    // iterate through fields in the configuration
    return config.map((fieldObj) => fieldObj.field).reduce((agg, field, index) => {
      // apply in order: matchByCompare, regex, blacklist, whitelist
      let matchByCompareResult = [];
      let regexResult;
      let blacklistResult;
      let whitelistResult;
      let cleanResult;
      // verify properties exist on config for field before trying to apply
      if (
        Object.prototype.hasOwnProperty.call(config[index], 'matchByCompare')
        && Object.prototype.hasOwnProperty.call(config[index], 'matchThreshold')
        && Object.prototype.hasOwnProperty.call(config[index], 'matchByCompareTargetRegex')
        && agg[config[index].matchByCompare] !== ''
      ) {
        matchByCompareResult = businessCardParser.applyMatchByCompare(
          sentences,
          agg[config[index].matchByCompare].match(config[index].matchByCompareTargetRegex).join(''),
          config[index].matchThreshold,
        );
      }
      // if there is a good match from comparison, clean the result and skip other steps
      if (matchByCompareResult.length === 1) {
        cleanResult = businessCardParser.cleanString(matchByCompareResult[0], config[index].clean);
      } else {
        // otherwise apply the regex, blacklist, and whitelist
        regexResult = businessCardParser.filterByRegex(sentences, config[index].regex);
        blacklistResult = businessCardParser.applyBlacklist(
          config[index].blacklist,
          regexResult,
        );
        whitelistResult = businessCardParser.applyWhitelist(
          config[index].whitelist,
          blacklistResult,
        );

        // if no whitelist results, fall back to blacklist results and clean the first result
        if (whitelistResult.length > 0) {
          cleanResult = businessCardParser.cleanString(whitelistResult[0], config[index].clean);
        } else {
          cleanResult = businessCardParser.cleanString(
            blacklistResult[0] || '',
            config[index].clean,
          );
        }
      }
      // add to accumulation object to output
      return {
        ...agg,
        [field]: cleanResult,
      };
    }, {});
  },

  /**
   * The stringCommonality method takes two strings and returns the percentage of the second
   * string that matched substrings from str1
   * @param {String} str1 A string chunk up and use for match searching
   * @param {String} str2 A string that should be matched against for commonality
   * @returns A score between 0 and 1 that represents a decimal commonality betwen str2 and str1
   */
  stringCommonality: (str1, str2) => {
    let score = 0;
    const maxScore = str2.length;
    let matchStr = str2.toLowerCase();
    // split words in str1 and search for that substring in str2
    str1.split(' ').forEach((word) => {
      if (matchStr.includes(word.toLowerCase())) {
        // on match, add the word length to score and remove the found segment from str2
        score += word.length;
        matchStr = matchStr.replace(word.toLowerCase(), '');
      }
    });
    return score / maxScore;
  },

  /**
   * The applyMatchByCompare method takes an array of sentences, a string to compare against, and
   * a threshold minimum that should be met to consider a sentence sufficiently similar to the
   * compareTargetStr
   * @param {Array} sentences Several sentences that should be tested
   * @param {String} compareTargetStr A string to search for matches in
   * @param {Number} thresold A decimal from 0 to 1 that tells commonality required between
   * compareTargetStr and a sentence in the sentences array
   */
  applyMatchByCompare: (sentences, compareTargetStr, threshold) => {
    // accumulate scores for all sentences by applying the string commonality test to each sentence
    const matchDecimalArr = sentences.map(
      (sentence) => businessCardParser.stringCommonality(
        sentence,
        compareTargetStr,
      ),
    );
    // find the index of the largest percent
    const bestMatchInd = matchDecimalArr.reduce(
      (indexWithMaxPct, percentVal, ind, coll) => {
        if (percentVal > coll[indexWithMaxPct]) {
          return ind;
        }
        return indexWithMaxPct;
      },
      0,
    );
    // check if the largest percent is greater than threshold. If so, return that sentence,
    // otherwise return an empty array
    if (matchDecimalArr[bestMatchInd] >= threshold) {
      return [sentences[bestMatchInd]];
    }
    return [];
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
      let isValid = true;
      // use for loop to allow early breakout, iterate through words in blacklist
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < blacklist.length; i++) {
        if (sent.toLowerCase().includes(blacklist[i])) {
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
      let isMatch = false;
      // use for loop to allow early breakout, iterate through words in whitelist
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < whitelist.length; i++) {
        if (sent.toLowerCase().includes(whitelist[i])) {
          isMatch = true;
          break;
        }
      }
      return isMatch;
    });
  },
};

module.exports = businessCardParser;
