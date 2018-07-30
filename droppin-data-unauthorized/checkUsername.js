import * as db from './lib/mongodb-lib';
import { success, failure } from './lib/response-lib';

export async function main(event, context, callback) {
  const { username } = JSON.parse(event.body);
  try {
    const result = await db.checkUsername(username);
    if (result) {
      callback(null, success(true));
    } else {
      callback(null, success(false));
    }
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
