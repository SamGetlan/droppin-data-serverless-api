import mongoose from 'mongoose';
import { Game, User } from './mongodb-models';

mongoose.connect(`mongodb://${process.env.mongoUsername}:${process.env.mongoPassword}@ds119585.mlab.com:19585/droppin_data`);

const getCurrentSeason = (date) => {
  console.log('date:', date);
  console.log('date getTime:', date.getTime());
  if (date.getTime() < s4Start) {
    return 3;
  } else if (date.getTime() < s5Start) {
    return 4;
  } else if (date.getTime() < s6Start) {
    return 5;
  } else if (date.getTime() >= s6Start) {
    return 6;
  }
}

const checkGamePlayed = (gamePlayed) => {
  gamePlayed.place = Number(gamePlayed.place);
  gamePlayed.kills = Number(gamePlayed.kills);
  gamePlayed.loot = Number(gamePlayed.loot);
  return (typeof gamePlayed.user === 'string' && typeof gamePlayed.location === 'string' && typeof gamePlayed.place === 'number' && gamePlayed.place > 0 && gamePlayed.place < 101 && typeof gamePlayed.kills === 'number' && gamePlayed.kills >= 0 && gamePlayed.kills < 100 && typeof gamePlayed.loot === 'number' && gamePlayed.loot > 0 && gamePlayed.loot <= 10 && (gamePlayed.gameType === 'solo' || gamePlayed.gameType === 'duo' || gamePlayed.gameType === 'squad'));
}

/* ---------------------------- */
/* ~~~  Exported Functions  ~~~ */
/* ---------------------------- */

export const saveGame = (gamePlayed) => {
  if (checkGamePlayed(gamePlayed)) {
    const date = new Date();
    const game = new Game({
      user: gamePlayed.user,
      locationTracking: gamePlayed.locationTracking,
      date,
      season: getCurrentSeason(date),
      location: gamePlayed.location,
      startCoordinates: gamePlayed.startCoordinates,
      place: gamePlayed.place,
      kills: gamePlayed.kills,
      loot: gamePlayed.loot,
      gameType: gamePlayed.gameType,
      deathLocation: gamePlayed.death,
      stormDeath: gamePlayed.stormDeath,
      deathCoordinates: gamePlayed.deathCoordinates,
    });
    return game.save();
  } else {
    return 'Invalid Game';
  }
};

export const loadGames = user => Game.find({ user }, null, {sort: '-date'}).exec();


export const checkUsername = username => User.findOne({ username }).exec();

export const checkEmail = email => User.findOne({ email }).exec(); 

export const checkToken = token => User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }).exec();

export const updateSettings = (username, update, callback) => {
  User.findOneAndUpdate({ username }, update, { new: true }, (err, user) => {
    if (err) {
      console.log('There was an error inside updateSettings:', err);
    } else {
      callback(err, user);
    }
  });
}

export const updateGame = (gameId, update) => Game.findByIdAndUpdate(gameId, update, { new: true }).exec();

export const deleteGame = gameId => Game.findByIdAndRemove(gameId).exec();
