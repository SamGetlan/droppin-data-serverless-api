import * as mongoDBLib from './libs/mongodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const user = event.requestContext.identity.cognitoIdentityId;

  try {
    const games = await mongoDBLib.loadGames(user);
    callback(null, success(games));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}