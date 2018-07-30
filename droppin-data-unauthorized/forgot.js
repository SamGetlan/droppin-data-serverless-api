
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import * as db from './lib/mongodb-lib';
import { success, failure } from './lib/response-lib';

export async function main(event, context, callback) {
  let { email } = JSON.parse(event.body);
  email = email.toLowerCase();

  const tokenGenerator = () => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(20, (err, buf) => {
        if (err) {
          reject(err);
        } else {
          resolve(buf.toString('hex'));
        }
      })
    })
  }

  try {
    const token = await tokenGenerator();
    const user = await db.checkEmail(email);
    if (user) {
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save()
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
        subject: 'DroppinData Account Recovery',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account. \n\n' + 
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' + 
          'https://www.DroppinData.com/reset/' + token + '\n\n' + 
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
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
      }
      let mailed = await sendMail(mailOptions);
      if (mailed === 'done') {
        callback(null, success({ message: 'email sent' }));
      } else {
        callback(null, success({ err: mailed }));
      }
    } else {
      callback(null, success({ message: 'no user found' }));
    }
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}