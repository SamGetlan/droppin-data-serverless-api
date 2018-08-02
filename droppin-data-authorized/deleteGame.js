import * as mongoDBLib from './libs/mongodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const gameId = JSON.parse(event.body).gameId;

  try {
    const game = await mongoDBLib.deleteGame(gameId);
    callback(null, success(game));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}