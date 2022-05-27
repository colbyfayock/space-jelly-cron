require('dotenv').config();

const { sendMail } = require('../src/lib/mail');

const { emailList } = require('../ignore-this');

(async function run() {
  console.log('=== Begin Send Mail ===')

  for ( let i = 0; i < emailList.length; i++ ) {
    await (new Promise((resolve) => {
      setTimeout(async () => {
        const person = emailList[i];

        console.log(emailList[i]);

        await sendMail({
          to: person.email,
          subject: 'Subject',
          message: [
            'Hey there!',
          ].join('\r\n')
        });

        resolve();
      }, 1000);
    }))
  }


  console.log('=== End Send Mail ===')
})();