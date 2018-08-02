import * as mongoDBLib from './libs/mongodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);

  try {
    const game = mongoDBLib.updateGame(data.gameId, data.update);
    callback(null, success(game));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}