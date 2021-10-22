require('dotenv').config();

const { sendMail } = require('./lib/mail');

(async function run() {
  await sendMail({
    subject: 'Refreshing the spools',
    message: ' ',
    attachments: [
      {
        url: 'https://fay.io/printer-test.pdf',
        type: 'application/pdf',
        filename: 'printer-test.pdf'
      }
    ]
  });
})();