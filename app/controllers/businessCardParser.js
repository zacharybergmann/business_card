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
  getContactInfo(doc) {
    // takes a sequence of characters to extract the name, phoneNumber, and emailAddress from
    return new ContactInfo(
      this.extractName(doc),
      this.extractPhoneNumber(doc),
      this.extractEmailAddress(doc),
    );
  },

  /**
   * The extractName method takes non-homogeneous business card text and parses a person's
   * name from it
   * @param {String} doc A sequence of characters that should contain a person's name
   * @returns {String} A person's name
   */
  extractName(doc) {
    // Sources to find a person's name parser
    // https://www.regextester.com/93648
    // should also remove numbers, and normal patterns for company, etc???
    // instead use better method to recognize person names???
    const regex = new RegExp(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'gm'); // assumes English alphabet, no foreign names with symbols, etc
    const data = doc.match(regex)[0];
    return data;
  },

  /**
   * The extractPhoneNumber method takes non-homogeneous business card text and parses a person's
   * phone number from it
   * @param {String} doc A sequence of characters that should contain a person's phone number
   * @returns {String} A person's phone number with only digits, no spaces or special characters
   */
  extractPhoneNumber(doc) {
    // Sources for solution to extract domestic and international phone numbers using regex
    // https://stackoverflow.com/questions/3868753/find-phone-numbers-in-python-script
    // https://zapier.com/blog/extract-links-email-phone-regex/
    const regex = new RegExp(/(?:(?:\+?([1-9]|[0-9][0-9]|[0-9][0-9][0-9])\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([0-9][1-9]|[0-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/, 'g');
    const data = doc.match(regex)[0].replace(/[^0-9]/g, '');
    return data;
  },

  /**
   * The extractEmailAddress method takes non-homogeneous business card text and parses a person's
   * email address from it
   * @param {String} doc A sequence of characters that should contain a person's email address
   * @returns {String} A person's email address
   */
  extractEmailAddress(doc) {
    // Source to find most complete solution for standard email addresses, sub-domains,
    // and TLDs using regex (email and domain must be in standard English)
    // General Email Regex (RFC 5322 Official Standard)
    // http://emailregex.com/
    // https://zapier.com/blog/extract-links-email-phone-regex/
    // eslint-disable-next-line no-control-regex
    const regex = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, 'g');
    const data = doc.match(regex)[0];
    return data;
  },
};

module.exports = businessCardParser;
