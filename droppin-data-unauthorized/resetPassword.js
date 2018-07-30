import * as db from './lib/mongodb-lib';
import { success, failure } from './lib/response-lib';
import nodemailer from 'nodemailer';

export async function main(event, context, callback) {
  const { token, password } = JSON.parse(event.body);
  try {
    let user = await db.checkToken(token);
    console.log('user:', user);
    if (user) {
      user.password = user.generateHash(password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      let smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.sendGridUsername,
          pass: process.env.sendGridPassword,
        }
      });
      let mailOptions = {
        to: user.email,
        from: 'DroppinData@gmail.com',
        subject: 'DroppinData successful password reset',
        text: 'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n',
      };
      const sendMail = mailOptions => {
        return new Promise((resolve, reject) => {
          smtpTransport.sendMail(mailOptions, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve('done')
            }
          });
        });
      };
      let mailed = await sendMail(mailOptions);
      if (mailed === 'done') {
        callback(null, success({ message: 'email sent' }));
      } else {
        callback(null, success({ err: mailed }));
      }
    } else {
      callback(null, success({ message: 'Token is invalid or has expired' }));
    }
  } catch (e) {
    callback(null, failure({ status: e }));
  }
}