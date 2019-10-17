const { assert } = require('chai');
const ContactInfo = require('./ContactInfo');

describe('ContactInfo class', () => {
  it('should be defined', () => {
    assert.isDefined(ContactInfo);
  });

  it('should take a name, phone number, and email address and return an instance created from ContactInfo class', () => {
    assert.equal(true, new ContactInfo('Test Name', '1234567890', 'test@test.com') instanceof ContactInfo);
  });

  it('should throw if less or more than 3 arguments are passed to the constructor', () => {
    assert.equal(1, 2);
  });

  describe('getName method', () => {
    it('should exist and be a function', () => {
      const name = 'Test Name';
      const phoneNumber = '1234567890';
      const emailAddress = 'test@test.com';
      const exampleContactInfo = new ContactInfo(name, phoneNumber, emailAddress);
      assert.isDefined(true, exampleContactInfo.getName);
      assert.equal('function', typeof exampleContactInfo.getName);
    });

    it('should have a getName method that returns the input name', () => {
      const name = 'Test Name';
      const phoneNumber = '1234567890';
      const emailAddress = 'test@test.com';
      const exampleContactInfo = new ContactInfo(name, phoneNumber, emailAddress);
      assert.equal(name, exampleContactInfo.getName());
    });
  });

  describe('getPhoneNumber method', () => {
    it('should exist and be a function', () => {
      const name = 'Test Name';
      const phoneNumber = '1234567890';
      const emailAddress = 'test@test.com';
      const exampleContactInfo = new ContactInfo(name, phoneNumber, emailAddress);
      assert.isDefined(true, exampleContactInfo.getPhoneNumber);
      assert.equal('function', typeof exampleContactInfo.getPhoneNumber);
    });

    it('should have a getPhoneNumber method that returns the input name', () => {
      const name = 'Test Name';
      const phoneNumber = '1234567890';
      const emailAddress = 'test@test.com';
      const exampleContactInfo = new ContactInfo(name, phoneNumber, emailAddress);
      assert.equal(phoneNumber, exampleContactInfo.getPhoneNumber());
    });
  });

  describe('getEmailAddress method', () => {
    it('should exist and be a function', () => {
      const name = 'Test Name';
      const phoneNumber = '1234567890';
      const emailAddress = 'test@test.com';
      const exampleContactInfo = new ContactInfo(name, phoneNumber, emailAddress);
      assert.isDefined(true, exampleContactInfo.getEmailAddress);
      assert.equal('function', typeof exampleContactInfo.getEmailAddress);
    });

    it('should have a getEmailAddress property that returns the input name', () => {
      const name = 'Test Name';
      const phoneNumber = '1234567890';
      const emailAddress = 'test@test.com';
      const exampleContactInfo = new ContactInfo(name, phoneNumber, emailAddress);
      assert.equal(emailAddress, exampleContactInfo.getEmailAddress());
    });
  });
});
