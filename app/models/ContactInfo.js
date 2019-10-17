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
   * Get the name property
   * @returns {String} The contactInfo object name property
   */
  getName() {
    return this.name;
  }

  /**
   * Get the phone number property
   * @returns {String} The contactInfo object phoneNumber property
   */
  getPhoneNumber() {
    return this.phoneNumber;
  }

  /**
   * Get the email address property
   * @returns {String} The contactInfo object emailAddress property
   */
  getEmailAddress() {
    return this.emailAddress;
  }
}

module.exports = ContactInfo;
