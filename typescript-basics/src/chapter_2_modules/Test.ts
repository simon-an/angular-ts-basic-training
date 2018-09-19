import zip = require('./ZipCodeValidator');

// Some samples to try
let strings = ['Hello', '98052', '101'];

// Validators to use
let validator = new zip();

// Show whether each string passed each validator
strings.forEach(s => {
  console.log(`"${s}" - ${validator.isAcceptable(s) ? 'matches' : 'does not match'}`);
});

import validate from './StaticZipCodeValidator';

// Use function validate
strings.forEach(s => {
  console.log(`"${s}" ${validate(s) ? ' matches' : ' does not match'}`);
});
