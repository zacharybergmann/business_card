const { assert } = require('chai');
const sinon = require('sinon');
const config = require('./businessCardParserConfig');
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

    it('should call applyMatchByCompare, filterByRegex, applyBlacklist, applyWhitelist, and cleanString 3 times each', () => {
      const sentences = [];
      const applyMatchByCompareStub = sinon.stub(businessCardParser, 'applyMatchByCompare').returns([]);
      const filterByRegexStub = sinon.stub(businessCardParser, 'filterByRegex').returns([]);
      const applyBlacklistStub = sinon.stub(businessCardParser, 'applyBlacklist').returns([]);
      const applyWhitelistStub = sinon.stub(businessCardParser, 'applyWhitelist').returns([]);
      const cleanStringStub = sinon.stub(businessCardParser, 'cleanString').returns('');
      businessCardParser.classifyTextArr(sentences);
      assert.equal(applyMatchByCompareStub.callCount, 0);
      assert.equal(filterByRegexStub.callCount, 3);
      assert.equal(applyBlacklistStub.callCount, 3);
      assert.equal(applyWhitelistStub.callCount, 3);
      assert.equal(cleanStringStub.callCount, 3);
      applyMatchByCompareStub.restore();
      filterByRegexStub.restore();
      applyBlacklistStub.restore();
      applyWhitelistStub.restore();
      cleanStringStub.restore();
    });

    it('should call applyMatchByCompare, filterByRegex, applyBlacklist, applyWhitelist, and cleanString based on config fields', () => {
      const ocrText = 'ASYMMETRIK LTD\nMike Smith\nSenior Software Engineer\n(410)555-1234\nmsmith@asymmetrik.com';
      const sentences = ocrText.split('\n');
      const applyMatchByCompareStub = sinon.stub(businessCardParser, 'applyMatchByCompare');
      applyMatchByCompareStub.returns(['Mike Smith']);
      const filterByRegexStub = sinon.stub(businessCardParser, 'filterByRegex');
      filterByRegexStub.withArgs(sentences, config[0].regex).returns([sentences[4]]);
      filterByRegexStub.withArgs(sentences, config[1].regex).returns([sentences[3]]);
      const applyBlacklistStub = sinon.stub(businessCardParser, 'applyBlacklist');
      applyBlacklistStub.onFirstCall().returns([sentences[4]]);
      applyBlacklistStub.onSecondCall().returns([sentences[3]]);
      const applyWhitelistStub = sinon.stub(businessCardParser, 'applyWhitelist');
      applyWhitelistStub.onFirstCall().returns([]);
      applyWhitelistStub.onSecondCall().returns([]);
      const cleanStringStub = sinon.stub(businessCardParser, 'cleanString');
      cleanStringStub.onFirstCall().returns('msmith@asymmetrik.com');
      cleanStringStub.onSecondCall().returns('4105551234');
      cleanStringStub.onThirdCall().returns('Mike Smith');
      businessCardParser.classifyTextArr(sentences);
      assert.equal(applyMatchByCompareStub.callCount, 1);
      assert.equal(filterByRegexStub.callCount, 2);
      assert.equal(applyBlacklistStub.callCount, 2);
      assert.equal(applyWhitelistStub.callCount, 2);
      assert.equal(cleanStringStub.callCount, 3);
      applyMatchByCompareStub.restore();
      filterByRegexStub.restore();
      applyBlacklistStub.restore();
      applyWhitelistStub.restore();
      cleanStringStub.restore();
    });
  });

  describe('stringCommonality method', () => {
    it('should be defined and be a function', () => {
      assert.isDefined(businessCardParser.stringCommonality);
      assert.isFunction(businessCardParser.stringCommonality);
    });

    it('should return 0 when no substrings of the first string exist in the second string', () => {
      const str1 = 'The cat and the dog';
      const str2 = 'test';
      assert.equal(businessCardParser.stringCommonality(str1, str2), 0);
    });

    it('should return 1 when all of the second string can be found in the first string substrings', () => {
      const str1 = 'John Doe';
      const str2 = 'johndoe';
      assert.equal(businessCardParser.stringCommonality(str1, str2), 1);
    });

    it('should return 1 when all of the second string can be found in the first string substrings', () => {
      const str1 = 'John Doe';
      const str2 = 'jdoe';
      const expected = 0.75;
      assert.equal(businessCardParser.stringCommonality(str1, str2), expected);
    });
  });

  describe('applyMatchByCompare method', () => {
    it('should be defined and be a function', () => {
      assert.isDefined(businessCardParser.applyMatchByCompare);
      assert.isFunction(businessCardParser.applyMatchByCompare);
    });

    it('should return a single string in an array if it passes a threshold match', () => {
      const sentences = [
        'Cat dog',
        'Elephant industries',
        'Phone: 123-123-4567',
      ];
      const matchStr = 'catdog';
      const thresold = 0.5;
      assert.deepEqual(businessCardParser.applyMatchByCompare(sentences, matchStr, thresold), ['Cat dog']);
    });

    it('should return a single string in an array if it passes a threshold match', () => {
      const sentences = [
        'Cat test',
        'Elephant industries',
        'Phone: 123-123-4567',
      ];
      const matchStr = 'catdoge';
      const thresold = 0.5;
      assert.deepEqual(businessCardParser.applyMatchByCompare(sentences, matchStr, thresold), []);
    });
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

  describe('cleanString method', () => {
    it('should be defined and be a function', () => {
      assert.isDefined(businessCardParser.cleanString);
      assert.isFunction(businessCardParser.cleanString);
    });

    it('should return an empty string if the input string does not regex', () => {
      const input = 'test test.test test';
      const regex = /[0-9]/g;
      const expected = '';
      assert.equal(expected, businessCardParser.cleanString(input, regex));
    });

    it('should return a string with a match when regex matches', () => {
      const input = 'abcx1./,!$)(U)($RF23';
      const regex = /[abc]{3}/g;
      const expected = 'abc';
      assert.equal(expected, businessCardParser.cleanString(input, regex));
    });

    it('should return a string with all non-digits removed and concatenate the multiple matches', () => {
      const input = 'abcx1./,!$)(U)($RF23';
      const regex = /\d+/g;
      const expected = '123';
      assert.equal(expected, businessCardParser.cleanString(input, regex));
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
