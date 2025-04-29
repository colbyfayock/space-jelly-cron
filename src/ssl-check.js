require('dotenv').config();
const tls = require('tls');

const { sendMail } = require('../src/lib/mail');

const SSL_HOSTS = process.env.SSL_HOSTS?.split(',') || [];
const DAYS_THRESHOLD = 31; // Number of days before expiration to trigger a warning

(async function run() {
  console.log(`Checking SSL certificates...`);
  await Promise.all(SSL_HOSTS.map(async (host) => {
    try {
      const { daysLeft, expiresOn } = await checkCertificateExpiration(host);
      
      if ( daysLeft <= 0 ) {
        console.log(`❌ Found expired certificate.`);
        await sendMail({
          subject: `SSL Certificate Expired for ${host}`,
          message: `
            The SSL certificate for ${host} has expired.\r\n
            \r\n
            Expires on: ${expiresOn}\r\n
            \r\n
            Please take action to renew it.
          `,
        });
      } else if ( daysLeft < DAYS_THRESHOLD) {
        console.log(`⚠️ Found certificate that expires in ${daysLeft} days.`);
        await sendMail({
          subject: `SSL Certificate Expiration Warning for ${host}`,
          message: `
            The SSL certificate for ${host} will expire in ${daysLeft} days.\r\n
            \r\n
            Expires on: ${expiresOn}\r\n
            \r\n
            Please take action to renew it.
          `,
        });
      } else {
        console.log(`✅ Found valid certificate.`);
      }
    } catch (error) {
      console.error(error.message);
    }
    console.log('Done.')
  }));
})();

async function checkCertificateExpiration(domain, port = 443) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(port, domain, { servername: domain }, () => {
      const cert = socket.getPeerCertificate();
      if (!cert || !cert.valid_to) {
        socket.end();
        reject(new Error('Could not get certificate info.'));
        return;
      }

      const expiresOn = new Date(cert.valid_to);
      const now = new Date();
      const daysLeft = Math.ceil((expiresOn - now) / (1000 * 60 * 60 * 24));

      socket.end();
      resolve({ domain, daysLeft, expiresOn });
    });

    socket.on('error', (err) => {
      socket.end();
      reject(err);
    });
  });
}