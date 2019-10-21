const companies = require('./resources/companies.json');
const fax = require('./resources/fax.json');
const states = require('./resources/states.json');
// Roads list initialized from https://pe.usps.com/text/pub28/28apc_002.htm
const roads = require('./resources/roads.json');
const phone = require('./resources/phone.json');
// Job titles list initialized from
// https://github.com/Brunty/faker-buzzword-job-titles/blob/develop/src/BuzzwordJobProvider.php
const jobTitles = require('./resources/jobTitles.json');

const config = {
  name: {
    blacklist: [...companies, ...jobTitles],
    whitelist: [],
    regex: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/gm,
    clean: /.+/g,
  },
  email: {
    blacklist: [],
    whitelist: [],
    // eslint-disable-next-line no-control-regex
    regex: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g,
    clean: /\S+@\S+/,
  },
  phone: {
    blacklist: [...fax, ...states, ...roads],
    whitelist: [...phone],
    regex: /(?:(?:\+?([1-9]|[0-9][0-9]|[0-9][0-9][0-9])\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([0-9][1-9]|[0-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/g,
    clean: /\d+/g,
  },
};

module.exports = config;
