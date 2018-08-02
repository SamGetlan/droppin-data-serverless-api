import passport from 'passport';
// import configurePassport from './lib/passport-config';
import session from 'cookie-session';
import { success, failure } from './lib/response-lib';


// configurePassport(passport);

const authenticate = strategy => {
  return new Promise((resolve, reject) => {
    passport.authenticate(strategy, (err, user) => {
      if (err) { 
        reject(err); 
      } else {
        resolve(user);
      }
    });
  });
};

export async function main(event, context, callback) {
  console.log('event', event);
  session({ secret: process.env.secret, maxAge: 86400000 });
  console.log('before initialize');
  passport.initialize();
  console.log('before session');
  passport.session();
  console.log('after session');

  try {
    let user = await authenticate('local-signup');
    console.log(user);
    callback(null, success(user));
  } catch (e) {
    callback(null, failure(e));
  }
}
