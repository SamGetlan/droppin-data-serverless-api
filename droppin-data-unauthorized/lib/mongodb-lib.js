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

export const saveGame = (gamePlayed, callback) => {
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
    game.save((err, results) => {
      if (err) {
        console.log('There was an error:', err);
      } else {
        callback(results);
      }
    });
  } else {
    callback(gamePlayed);
  }
};

export const loadGames = (user, callback) => {
  Game.find({ user }, null, {sort: '-date'}, (err, games) => {
    if (err) {
      console.log('There has been an error:', err);
    } else {
      callback(games);
    }
  });
};

export const checkUsername = (username) => User.findOne({ username }).exec();

export const checkEmail = (email, callback) => {
  User.findOne({ email }, (err, result) => {
    if (err) {
      console.log('There was an error in checkEmail:', err);
    } else {
      callback(err, result);
    }
  });
};

export const checkToken = (token, callback) => {
  User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, (err, result) => {
    if (err) {
      console.log('There was an error inside checkToken:', err);
    } else {
      callback(err, result);
    }
  });
};

export const updateSettings = (username, update, callback) => {
  User.findOneAndUpdate({ username }, update, { new: true }, (err, user) => {
    if (err) {
      console.log('There was an error inside updateSettings:', err);
    } else {
      callback(err, user);
    }
  });
}

export const updateGame = (gameId, update, callback) => {
  console.log('inside updateGame with gameId:', gameId);
  Game.findByIdAndUpdate(gameId, update, { new: true }, (err, result) => {
    if (err) {
      console.log('There was an error inside updateGame:', err);
    } else {
      callback(err, result);
    }
  });
}

export const deleteGame = (gameId, callback) => {
  Game.findByIdAndRemove(gameId, (err, game) => {
    if (err) {
      console.log('There was an error inside deleteGame:', err);
    } else {
      callback(err, game);
    }
  });
}

// module.exports = {
//   saveGame,
//   loadGames,
//   checkUsername,
//   checkEmail,
//   checkToken,
//   updateSettings,
//   deleteGame,
//   updateGame,
// };
