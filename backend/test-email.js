require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

async function test() {
  try {
    await sendEmail({
      email: 'yasoni715@gmail.com',
      subject: 'Test Email',
      message: 'This is a test email'
    });
    console.log('Email sent successfully via test script');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
test();
