const cases = [
  {
    input: 'ASYMMETRIK LTD\nMike Smith\nSenior Software Engineer\n(410)555-1234\nmsmith@asymmetrik.com',
    output: {
      name: 'Mike Smith',
      email: 'msmith@asymmetrik.com',
      phone: '4105551234',
    },
  },
  {
    input: 'Foobar Technologies\nAnalytic Developer\nLisa Haung\n1234 Sentry Road\nColumbia, MD 12345\nPhone: 410-555-1234\nFax: 410-555-4321\nlisa.haung@foobartech.com',
    output: {
      name: 'Lisa Haung',
      email: 'lisa.haung@foobartech.com',
      phone: '4105551234',
    },
  },
  {
    input: 'Arthur Wilson\nSoftware Engineer\nDecision & Security Technologies\nABC Technologies\n123 North 11th Street\nSuite 229\nArlington, VA 22209\nTel: +1 (703) 555-1259\nFax: +1 (703) 555-1200\nawilson@abctech.com',
    output: {
      name: 'Arthur Wilson',
      email: 'awilson@abctech.com',
      phone: '17035551259',
    },
  },
  {
    input: 'John Inc\nSoftware Engineer\nDecision & Security Technologies\nABC Technologies\n123 North 11th Street\nSuite 229\nArlington, VA 22209\nTel: +1 (703) 555-1259\nFax: +1 (703) 555-1200\nj.inc@abctech.com',
    output: {
      name: 'John Inc',
      email: 'j.inc@abctech.com',
      phone: '17035551259',
    },
  },
  {
    input: 'Kwali Swelta\nSoftware Engineer\nDecision & Security Technologies\nABC Technologies\n123 North 11th Street\nSuite 229\nArlington, VA 22209\nF: +1 (703) 555-1200\nT: +1 (703) 555-1259\nswelta1@abctech.com',
    output: {
      name: 'Kwali Swelta',
      email: 'swelta1@abctech.com',
      phone: '17035551259',
    },
  },
];

module.exports = cases;
