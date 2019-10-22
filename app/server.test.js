const chai = require('chai');
const chaiHttp = require('chai-http');
const serverImport = require('./server');

const { assert, expect } = chai;
chai.use(chaiHttp);
const server = chai.request(serverImport).keepOpen();

after(() => {
  server.close();
});

describe('Server Application', () => {
  describe('OPTION /', () => {
    it('it should return a 200 response with potential request information', (done) => {
      server
        .options('/')
        .end((err, res) => {
          assert(res.status, 200);
          assert.equal(res.header['access-control-allow-origin'], '*');
          assert.equal(res.header['access-control-allow-methods'], 'GET,POST,OPTIONS');
          assert.equal(res.header['access-control-allow-headers'], 'Content-Type, Authorization, Content-Length, X-Requested-With');
          done();
        });
    });
  });

  describe('GET /', () => {
    it('it should GET the html web page', (done) => {
      server
        .get('/')
        .end((err, res) => {
          assert(res.status, 200);
          expect(res).to.be.html; // eslint-disable-line no-unused-expressions
          done();
        });
    });
  });

  describe('POST /v1/parseOcrText', () => {
    it('it should return a 400 status and an object with an error message if an inputText field is not passed', (done) => {
      const body = {};
      server
        .post('/v1/parseOcrText')
        .send(body)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, { error: 'Invalid request format' });
          done();
        });
    });

    it('it should return a 200 status and an object with parsed fields if an inputText field is passed', (done) => {
      const body = {
        inputText: 'ASYMMETRIK LTD\nMike Smith\nSenior Software Engineer\n(410)555-1234\nmsmith@asymmetrik.com',
      };
      server
        .post('/v1/parseOcrText')
        .send(body)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            name: 'Mike Smith',
            email: 'msmith@asymmetrik.com',
            phone: '4105551234',
          });
          done();
        });
    });
  });
});
