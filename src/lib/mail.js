const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * sendMail
 */

async function sendMail({ to = process.env.MAIL_TO, from = process.env.MAIL_FROM, subject, message }) {
  const errorBase = 'Failed to send mail';

  console.log('Constructing message...');

  if ( typeof message !== 'string' ) {
    throw new Error(`${errorBase}: message is not a string or is empty`);
  }

  console.log('Sending mail...');

  const { data, error } = await resend.emails.send({
    from: `Space Jelly Cron <${from}>`,
    to: [to],
    subject: subject || 'Space Jelly Cron',
    text: message,
    html: message.replace(/\r\n/g, '<br>'),
  });

  if (error) {
    throw new Error(`${errorBase}: ${error.message}`);
  }

  console.log('Mail sent successfully.');

  return data;  
}

module.exports.sendMail = sendMail;