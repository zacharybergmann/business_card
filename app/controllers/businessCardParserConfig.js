const companies = require('./resources/companies.json');
const fax = require('./resources/fax.json');
const states = require('./resources/states.json');
// Roads list initialized from https://pe.usps.com/text/pub28/28apc_002.htm
const roads = require('./resources/roads.json');
const phone = require('./resources/phone.json');
// Job titles list initialized from
// https://github.com/Brunty/faker-buzzword-job-titles/blob/develop/src/BuzzwordJobProvider.php
const jobTitles = require('./resources/jobTitles.json');
// Names list initialized from https://github.com/9b/heavy_pint
const names = require('./resources/names.json');

/** NOTE: All fields seen below are required on new parse fields except for matchByCompare,
 * matchByCompareRegex, and matchThreshold. If these fields are used, remember that fields
 * are parsed in the observed order and that to reference a field using matchByCompare, that
 * field must be above the new one.
*/

const businessCardParserConfig = [
  {
    field: 'email',
    blacklist: [],
    whitelist: [],
    // Email regex found at https://zapier.com/blog/extract-links-email-phone-regex/
    // eslint-disable-next-line no-control-regex
    regex: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g,
    clean: /\S+@\S+/,
  },
  {
    field: 'phone',
    blacklist: [...fax, ...states, ...roads],
    whitelist: [...phone],
    // Phone regex found at http://phoneregex.com/
    regex: /(?:(?:\+?([1-9]|[0-9][0-9]|[0-9][0-9][0-9])\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([0-9][1-9]|[0-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/g,
    clean: /\d+/g,
  },
  {
    field: 'name',
    blacklist: [...companies, ...jobTitles],
    whitelist: [...names],
    matchByCompare: 'email',
    matchByCompareTargetRegex: /(?=.+@)[a-zA-Z]+/g,
    matchThreshold: 0.30,
    regex: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/gm,
    clean: /.+/g,
  },
];

module.exports = businessCardParserConfig;
