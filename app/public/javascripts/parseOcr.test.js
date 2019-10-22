const sinon = require('sinon');
const pug = require('pug');
const { assert } = require('chai');
const { JSDOM } = require('jsdom');
const simulant = require('jsdom-simulant');
const parseOcr = require('./parseOcr');

const dom = new JSDOM(pug.renderFile('app/views/index.pug'));
global.document = dom.window.document;
global.window = dom.window;
global.fetch = () => {};
global.alert = () => {};
const submitButton = global.document.getElementsByClassName('parseButton')[0];
const textareaElement = global.document.getElementsByClassName('ocrInputTextArea')[0];
const event = simulant(global.window, 'click');
submitButton.addEventListener('click', () => {
  parseOcr();
});

describe('parseOcr function', () => {
  it('should exist and be a function', () => {
    assert.isDefined(parseOcr);
    assert.isFunction(parseOcr);
  });

  it('should call getElementsByClassName once searching for class name "ocrInputTextArea"', () => {
    global.fetch = sinon.stub().rejects();
    global.alert = sinon.spy();
    const getElementsByClassNameStub = sinon
      .stub(global.document, 'getElementsByClassName')
      .returns([{
        value: 'ASYMMETRIK LTD\nMike Smith\nSenior Software Engineer\n(410)555-1234\nmsmith@asymmetrik.com',
      }]);
    simulant.fire(submitButton, event);
    assert.equal(getElementsByClassNameStub.callCount, 1);
    assert.equal(getElementsByClassNameStub.args[0][0], 'ocrInputTextArea');
    getElementsByClassNameStub.restore();
    global.fetch = () => {};
    global.alert = () => {};
  });

  it('should successfully extract textarea text by searching for the node with class "ocrInputTextArea" and post to /v1/parseOcrText', () => {
    global.fetch = sinon.stub().rejects();
    global.alert = sinon.spy();
    const inputText = 'ASYMMETRIK LTD\nMike Smith\nSenior Software Engineer\n(410)555-1234\nmsmith@asymmetrik.com';
    textareaElement.textContent = inputText;
    simulant.fire(submitButton, event);
    assert.equal(global.fetch.args[0][0], '/v1/parseOcrText');
    assert.deepEqual(global.fetch.args[0][1], {
      method: 'POST',
      body: JSON.stringify({ inputText }),
      headers: { 'Content-Type': 'application/json' },
    });
    global.fetch = () => {};
    global.alert = () => {};
  });

  it('should call alert once if fetch rejects', (done) => {
    global.fetch = sinon.stub().rejects();
    global.alert = sinon.spy();
    simulant.fire(submitButton, event);
    // needed to get this test behind async fetch call in JS event loop
    setTimeout(() => {
      assert.equal(global.fetch.callCount, 1);
      assert.equal(global.alert.callCount, 1);
      global.fetch = () => {};
      global.alert = () => {};
      done();
    }, 0);
  });

  it('should append 1 ul and 3 li to div with class "outputTextContainer" page after fetch resolves', (done) => {
    // faking Response object returned from Fetch API
    global.fetch = sinon.stub().resolves({
      json: () => ({
        name: 'Mike Smith',
        email: 'msmith@asymmetrik.com',
        phone: '4105551234',
      }),
    });
    global.alert = sinon.spy();
    simulant.fire(submitButton, event);
    // needed to get this test behind async fetch call in JS event loop
    setTimeout(() => {
      assert.equal(global.fetch.callCount, 1);
      assert.equal(global.alert.callCount, 0);
      assert.equal(global.document.getElementsByClassName('outputTextContainer')[0].children.length, 1);
      assert.equal(global.document.getElementsByClassName('outputTextList')[0].children.length, 3);
      assert.equal(global.document.getElementsByClassName('outputTextList')[0].children[0].textContent, 'Name: Mike Smith');
      assert.equal(global.document.getElementsByClassName('outputTextList')[0].children[1].textContent, 'Email: msmith@asymmetrik.com');
      assert.equal(global.document.getElementsByClassName('outputTextList')[0].children[2].textContent, 'Phone: 4105551234');
      global.fetch = () => {};
      global.alert = () => {};
      done();
    }, 0);
  });

  it('should remove and re-append 1 ul and 3 li to div with class "outputTextContainer" page after fetch resolves', (done) => {
    // faking Response object returned from Fetch API
    global.fetch = sinon.stub().resolves({
      json: () => ({
        name: 'Lisa Haung',
        email: 'lisa.haung@foobartech.com',
        phone: '4105551234',
      }),
    });
    global.alert = sinon.spy();
    // confirm previous state still on DOM
    assert.equal(global.document.getElementsByClassName('outputTextContainer')[0].children.length, 1);
    assert.equal(global.document.getElementsByClassName('outputTextList')[0].children.length, 3);
    assert.equal(global.document.getElementsByClassName('outputTextList')[0].children[0].textContent, 'Name: Mike Smith');
    assert.equal(global.document.getElementsByClassName('outputTextList')[0].children[1].textContent, 'Email: msmith@asymmetrik.com');
    assert.equal(global.document.getElementsByClassName('outputTextList')[0].children[2].textContent, 'Phone: 4105551234');
    simulant.fire(submitButton, event);
    // needed to get this test behind async fetch call in JS event loop
    setTimeout(() => {
      assert.equal(global.fetch.callCount, 1);
      assert.equal(global.alert.callCount, 0);
      assert.equal(global.document.getElementsByClassName('outputTextContainer')[0].children.length, 1);
      assert.equal(global.document.getElementsByClassName('outputTextList')[0].children.length, 3);
      assert.equal(global.document.getElementsByClassName('outputTextList')[0].children[0].textContent, 'Name: Lisa Haung');
      assert.equal(global.document.getElementsByClassName('outputTextList')[0].children[1].textContent, 'Email: lisa.haung@foobartech.com');
      assert.equal(global.document.getElementsByClassName('outputTextList')[0].children[2].textContent, 'Phone: 4105551234');
      global.fetch = () => {};
      global.alert = () => {};
      done();
    }, 0);
  });
});
