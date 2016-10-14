var accountSid = require('../../apis.js').TWILIO_ACCOUNT_SID;
var authToken = require('../../apis.js').TWILIO_AUTH_TOKEN;


module.exports = {
  DATABASE_URI: 'postgres://localhost:5432/testing-fsg',
  SESSION_SECRET: 'Optimus Prime is my real dad',
  TWILIO_ACCOUNT_SID: accountSid,
  TWILIO_AUTH_TOKEN: authToken,
  TWITTER: {
    consumerKey: 'INSERT_TWITTER_CONSUMER_KEY_HERE',
    consumerSecret: 'INSERT_TWITTER_CONSUMER_SECRET_HERE',
    callbackUrl: 'INSERT_TWITTER_CALLBACK_HERE'
  },
  FACEBOOK: {
    clientID: 'INSERT_FACEBOOK_CLIENTID_HERE',
    clientSecret: 'INSERT_FACEBOOK_CLIENT_SECRET_HERE',
    callbackURL: 'INSERT_FACEBOOK_CALLBACK_HERE'
  },
  GOOGLE: {
    clientID: 'INSERT_GOOGLE_CLIENTID_HERE',
    clientSecret: 'INSERT_GOOGLE_CLIENT_SECRET_HERE',
    callbackURL: 'INSERT_GOOGLE_CALLBACK_HERE'
  },
  LOGGING: false,
  NATIVE: true
};
