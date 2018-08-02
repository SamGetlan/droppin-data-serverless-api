import * as mongoDBLib from './libs/mongodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const gamePlayed = JSON.parse(event.body);
  gamePlayed.user = event.requestContext.identity.cognitoIdentity;

  try {
    const game = await mongoDBLib.saveGame(gamePlayed);
    callback(null, success(game));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}