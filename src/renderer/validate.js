
import { extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import PhoneNumber from 'awesome-phonenumber';

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

extend('phone_number', {
  validate(value, args) {
    const countryCode = args.length ? args[0] : 'US';
    return new Promise((resolve) => {
      const phone = new PhoneNumber(value, countryCode);
      resolve({ valid: phone.isValid() });
    });
  },
  message: field => `${field} is not a valid phone number`,
});

const { postcodeValidator } = require('postcode-validator');
extend('postcode', {
  message: () => 'Zip code is not a valid',
  validate(value, args) {
    return new Promise((resolve) => {
      if (['US', 'CA'].includes(args[0])) {
        resolve({ valid: postcodeValidator(value, args[0]) });
      } else {
        resolve({ valid: true });
      }
    });
  },
});
