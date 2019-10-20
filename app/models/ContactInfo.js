/**
 * Class representing the contact information for a person.
 */
class ContactInfo {
  /**
   * Creates an instance of the ContactInfo class
   * @param {String} name A person's name
   * @param {String} phoneNumber A person's phone number
   * @param {String} emailAddress A person's email address
   */
  constructor(name, phoneNumber, emailAddress) {
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.emailAddress = emailAddress;
  }

  /**
   * The getName method gets the name property from a contactInfo instance
   * @returns {String} The contactInfo object name property
   */
  getName() {
    return this.name;
  }

  /**
   * The getPhoneNumber method gets the phoneNumber property from a contactInfo instance
   * @returns {String} The contactInfo object phoneNumber property
   */
  getPhoneNumber() {
    return this.phoneNumber;
  }

  /**
   * The getEmailAddress method gets the emailAddress property from a contactInfo instance
   * @returns {String} The contactInfo object emailAddress property
   */
  getEmailAddress() {
    return this.emailAddress;
  }
}

module.exports = ContactInfo;
