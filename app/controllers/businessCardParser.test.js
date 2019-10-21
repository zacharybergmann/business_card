const { assert } = require('chai');
const sinon = require('sinon');
const businessCardParser = require('./businessCardParser');
const ContactInfo = require('../models/ContactInfo');
const cases = require('./testAssets/cases');

describe('businessCardParser object', () => {
  it('should exist and be an object', () => {
    assert.isDefined(businessCardParser);
    assert.isObject(businessCardParser);
  });

  describe('getContactInfo method', () => {
    it('should exist and be a function', () => {
      assert.isDefined(businessCardParser.getContactInfo);
      assert.isFunction(businessCardParser.getContactInfo);
    });

    it('should call classifyTextArr method with the split doc string when empty and return a ContactInfo instance', () => {
      const aSent = '';
      const classifyTextArrSpy = sinon.stub(businessCardParser, 'classifyTextArr').returns({ name: [''], phone: [''], email: [''] });
      const returnVal = businessCardParser.getContactInfo(aSent);
      assert.equal(classifyTextArrSpy.callCount, 1);
      assert.deepEqual(classifyTextArrSpy.args[0][0], ['']);
      assert.equal(returnVal instanceof ContactInfo, true);
      classifyTextArrSpy.restore();
    });

    it('should call classifyTextArr method with the split doc string when has length and return a ContactInfo instance', () => {
      const aSent = 'A test sentence\nA second test sentence\nA third test sentence';
      const classifyTextArrSpy = sinon.stub(businessCardParser, 'classifyTextArr').returns({ name: aSent.split('\n'), phone: [''], email: [''] });
      const returnVal = businessCardParser.getContactInfo(aSent);
      assert.deepEqual(classifyTextArrSpy.args[0][0], aSent.split('\n'));
      assert.equal(classifyTextArrSpy.callCount, 1);
      assert.equal(returnVal instanceof ContactInfo, true);
      classifyTextArrSpy.restore();
    });
  });

  describe('classifyTextArr method', () => {
    it('should be defined and be a function', () => {
      assert.isDefined(businessCardParser.classifyTextArr);
      assert.isFunction(businessCardParser.classifyTextArr);
    });

    it('should call applyBlacklist once with ')
  });

  describe('filterByRegex method', () => {
    it('should be defined and be a function', () => {
      assert.isDefined(businessCardParser.filterByRegex);
      assert.isFunction(businessCardParser.filterByRegex);
    });

    it('should return a new array each time (not mutate)', () => {
      const input = ['abc', '123', 'x1y'];
      const regex = /.+/g;
      assert.notEqual(input, businessCardParser.filterByRegex(input, regex));
      assert.deepEqual(input, businessCardParser.filterByRegex(input, regex));
    });

    it('should apply the regex when passed in (abc letters)', () => {
      const input = ['abc', '123', 'x1y'];
      const expected = ['abc'];
      const regex = /[abc]{3}/g;
      assert.deepEqual(expected, businessCardParser.filterByRegex(input, regex));
    });

    it('should apply the regex when passed in (abc and digits)', () => {
      const input = ['abc', '123', 'x1y'];
      const expected = ['abc', '123'];
      const regex = /[abc0-9]{3}/g;
      assert.deepEqual(expected, businessCardParser.filterByRegex(input, regex));
    });
  });

  describe('cleanEmail method', () => {
    it('should be defined and be a function', () => {
      assert.isDefined(businessCardParser.cleanEmail);
      assert.isFunction(businessCardParser.cleanEmail);
    });

    it('should return an empty string if the input string does not match email format', () => {
      const input = 'test test.test test';
      const expected = '';
      assert.equal(expected, businessCardParser.cleanEmail(input));
    });

    it('should return the email if the input string contains one', () => {
      const input = 'test test@test.com test';
      const expected = 'test@test.com';
      assert.equal(expected, businessCardParser.cleanEmail(input));
    });
  });

  describe('cleanPhone method', () => {
    it('should be defined and be a function', () => {
      assert.isDefined(businessCardParser.cleanPhone);
      assert.isFunction(businessCardParser.cleanPhone);
    });

    it('should return an empty string if the input string does not match phone format', () => {
      const input = 'test test.test test';
      const expected = '';
      assert.equal(expected, businessCardParser.cleanPhone(input));
    });

    it('should return a string with all non-digits removed', () => {
      const input = 'abcx1./,!$)(U)($RF23';
      const expected = '123';
      assert.equal(expected, businessCardParser.cleanPhone(input));
    });
  });

  describe('applyBlacklist method', () => {
    it('should be defined and be a function', () => {
      assert.isDefined(businessCardParser.applyBlacklist);
      assert.isFunction(businessCardParser.applyBlacklist);
    });

    it('should return a new output array (not mutate)', () => {
      const blacklist = ['test', 'abc', 'cycle', '123?!!'];
      const sentences = ['123?!!', 'abc', 'def', 'elephant'];
      assert.notDeepEqual(sentences, businessCardParser.applyBlacklist(blacklist, sentences));
    });

    it('should return only the sentence words that are not in the blacklist', () => {
      const blacklist = ['test', 'abc', 'cycle', '123?!!'];
      const sentences = ['123?!!', 'abc', 'def', 'elephant'];
      const expected = ['def', 'elephant'];
      assert.deepEqual(expected, businessCardParser.applyBlacklist(blacklist, sentences));
    });
  });

  describe('applyWhitelist method', () => {
    it('should be defined and be a function', () => {
      assert.isDefined(businessCardParser.applyWhitelist);
      assert.isFunction(businessCardParser.applyWhitelist);
    });

    it('should return a new output array (not mutate)', () => {
      const whitelist = ['test', 'abc', 'cycle', '123?!!'];
      const sentences = ['123?!!', 'abc', 'def', 'elephant'];
      assert.notDeepEqual(sentences, businessCardParser.applyWhitelist(whitelist, sentences));
    });

    it('should return only the sentence words that are not in the whitelist', () => {
      const whitelist = ['test', 'abc', 'cycle', '123?!!'];
      const sentences = ['123?!!', 'abc', 'def', 'elephant'];
      const expected = ['123?!!', 'abc'];
      assert.deepEqual(expected, businessCardParser.applyWhitelist(whitelist, sentences));
    });
  });

  describe('test cases', () => {
    cases.forEach((cas, index) => {
      it(`should pass test case #${index + 1}`, () => {
        assert.deepEqual(
          businessCardParser.getContactInfo(cas.input),
          new ContactInfo(
            cas.output.name,
            cas.output.phone,
            cas.output.email,
          ),
        );
      });
    });
  });
});
