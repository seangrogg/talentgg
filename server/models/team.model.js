var Sequelize = require( 'sequelize' );
var db = require( '../config/db.js' );

var Team = db.define( 'team', {

  //Standard fields
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  //Team-specific schema
  profile: {
    //This is for storing team-level data, similar to bio
    type: Sequelize.JSON,
    defaultValue: {
      teamName: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
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
      about: "You haven't filled this out yet"   
    }
  },
  teamCaptain: {
    type: Sequelize.INTEGER
  },
  members: {
    //This is for storing the members that are part of the team
    type: Sequelize.JSON,
    defaultValue: []
  },
  game: {
    //This is for storing the team's game data, should only be one game
    type: Sequelize.JSON,
    defaultValue: {}
  }
} );

Team.sync();

module.exports = Team;
