var gpio = require('chip-gpio').Gpio;
var btn = new Gpio(1, 'in', 0, 'both', {
  debounceTimeout: 500
});

// Nodejs encryption with CTR
const crypto = require('crypto');

// setup configuration
var nconf = require('nconf');
nconf.argv()
  .env()
  .file({ file: 'config.json' });

function encrypt(text) {
 let cipher = crypto.createCipher('aes-256-cbc', Buffer.from(nconf.key));
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return encrypted.toString('hex');
}

function decrypt(text) {
 let encryptedText = Buffer.from(text, 'hex');
 let decipher = crypto.createDecipher('aes-256-cbc', Buffer.from(nconf.key));
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}

function tooQuick() {
  let lastCall = process.env.LASTCALL;
  
  console.log('[email] function last called at: ' + lastCall);
  
  let timeDiff = Date.now() - lastCall;
  if (timeDiff < 25000) {
    console.log('[email] function called too quickly');
    return true;
  }
  
  // set the call timestamp
  process.env.LASTCALL = Date.now();
  return false;
}

function checkApiKey(text) {
  if (text == null || text == '') {
    console.log('[email] api key not specified');
    return false;
  }
  
  let key = decrypt(process.env.ENCKEY);
  let dectext = decrypt(text);
  
  if (dectext == key) {
    return true;
  }
  
  console.log('[email] api key does not match');
}
  
function sendEmail() {
  console.log('[email] sending email');
 
  // Require'ing module and setting default options 
  var send = require('gmail-send')({
    user: decrypt(nconf.username),
    // user: credentials.user,                  // Your GMail account used to send emails
    pass: decrypt(nconf.passwd),
    // pass: credentials.pass,                  // Application-specific password
    to:  nconf.toemails,
    // to:   credentials.user,                  // Send to yourself
    // from:    credentials.user,            // from: by default equals to user
    // replyTo: credentials.user,            // replyTo: by default undefined
    // bcc: 'some-user@mail.com',            // almost any option of `nodemailer` will be passed to it
    subject: 'Ding Dong!',
    text:    'ding dong',         // Plain text
    //html:    '<b>html text</b>'            // HTML
  });
  
  send({}, function (err, res) {
    console.log('[email] send() callback returned: err:', err, '; res:', res);
    message = res;
  });
}

function exit() {
  btn.unexport();
  process.exit();
}

btn.watch(function (err, value) {
  if (err) {
      throw err;
  }
  sendEmail();
});

process.on('SIGINT', exit);