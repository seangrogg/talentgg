var Sequelize = require( 'sequelize' );
var db = require( '../config/db.js' );

var rand;
setInterval(function(){ rand = Math.floor(Math.random() * 100000) }, 1000);

var User = db.define( 'user', {
  //This implementation automatically includes the following fields:
  //id, username, hash, salt, activationKey, resetPasswordKey, createdAt, updatedAt
  //we will be treating the user's email as their username
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: { //acts as the username
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  hash: {
    type: Sequelize.STRING,
    allowNull: false
  },
  displayName: {
    //This is the user's in-app name, defaulted to something like newbro123456
    type: Sequelize.STRING,
    unique: false,
    allowNull: false
  },
  bio: {
    //This is for storing the user's essay data and perhaps any other person-level data
    type: Sequelize.JSON,
    defaultValue: {
     times: {
        "weekdays": false,
        "weeknights": false,
        "weekends": false
      },
      purpose: {
        "3x3 Casual": false,
        "5x5 Casual": false,
        "5x5 Ranked": false
      },
      lanes: {
        "top": false,
        "mid": false,
        "bot": false,
        "jungle": false
      },
      roles: {
        "assassin": false,
        "mage": false,
        "marksman": false,
        "bruiser": false,
        "support": false,
        "tank": false
      },
     about: "I haven't filled this out yet.",
     favorite: "I haven't filled this out yet."
    }
  },
  teams: {
    //This is for storing the teams that the user is on
    type: Sequelize.JSON,
    defaultValue: []
  },
  games: {
    //This is for storing the user's game-related data
    type: Sequelize.JSON,
    defaultValue: {
      avatar: "http://33.media.tumblr.com/avatar_8ae248e55917_128.png",
      verified: false,
      verifyKey: false
    }
  },
  counter: {                  // redo this and answer history into one json object
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  answerHistory: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    defaultValue: []
  },
  ratings: {
    //This is for storing the user's attributes
    type: Sequelize.JSON,
    defaultValue: {
      dominance: 0,
      adaptable: 0,
      blunt: 0,
      collaborative: 0,
      brute: 0,
      aggressive: 0,
      boundaries: 0,
      loud: 0,
      committed: 0,
      ambition: 0
    }
  },
  temp: {
    type: Sequelize.JSON,
    defaultValue: {
      updatedAt: Date.now(),
      rank: 'unranked',
      matches: []
    }
  }
});

User.sync();

module.exports = User;
