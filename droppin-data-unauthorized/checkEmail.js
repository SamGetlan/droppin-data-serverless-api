import * as db from './lib/mongodb-lib';
import { success, failure } from './lib/response-lib';

export async function main(event, context, callback) {
  let { email } = JSON.parse(event.body);
  email = email.toLowerCase();
  try {
    const result = await db.checkEmail(email);
    if (result) {
      callback(null, success(true));
    } else {
      callback(null, success(false));
    }
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}