const { assert } = require('chai');
const sinon = require('sinon');
const businessCardParser = require('./businessCardParser');
const ContactInfo = require('../models/ContactInfo');

describe('businessCardParser object', () => {
  it('should exist and be an object', () => {
    assert.isDefined(businessCardParser);
    assert.equal(typeof businessCardParser, 'object');
  });

  describe('getContactInfo method', () => {
    it('should exist and be a function', () => {
      assert.isDefined(businessCardParser.getContactInfo);
      assert.equal(typeof businessCardParser.getContactInfo, 'function');
    });

    it('should call classifyTextArr method with the split doc string when empty and return a ContactInfo instance', () => {
      const aSent = '';
      const classifyTextArrSpy = sinon.stub(businessCardParser, 'classifyTextArr').returns({ name: [''], phoneNumber: [''], emailAddress: [''] });
      const returnVal = businessCardParser.getContactInfo(aSent);
      assert.equal(classifyTextArrSpy.callCount, 1);
      assert.deepEqual(classifyTextArrSpy.args[0][0], ['']);
      assert.equal(returnVal instanceof ContactInfo, true);
      classifyTextArrSpy.restore();
    });

    it('should call classifyTextArr method with the split doc string when has length and return a ContactInfo instance', () => {
      const aSent = 'A test sentence\nA second test sentence\nA third test sentence';
      const classifyTextArrSpy = sinon.stub(businessCardParser, 'classifyTextArr').returns({ name: aSent.split('\n'), phoneNumber: [''], emailAddress: [''] });
      const returnVal = businessCardParser.getContactInfo(aSent);
      assert.deepEqual(classifyTextArrSpy.args[0][0], aSent.split('\n'));
      assert.equal(classifyTextArrSpy.callCount, 1);
      assert.equal(returnVal instanceof ContactInfo, true);
      classifyTextArrSpy.restore();
    });
  });
});
