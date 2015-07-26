var User = require( '../models/user.model' );
var Team = require('../models/team.model');
var passport = require( 'passport' );
var bcrypt = require('bcryptjs');
var request = require('request');
var config = require('../config/config');
var gen = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

module.exports = {

  // Own user functions

  register: function( req, res, next ) { // Creates a new user
    var username = req.body.username, password = req.body.password;
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(password, salt, function(err, hash){
        User.create({
          username: username,
          hash: hash,
          displayName: "newbro" + Math.floor(Math.random()*100000)
        })
        .then(function(data){
          passport.authenticate('local')(req, res, function(){
            res.redirect('/');
          });
        })
        .catch(function(err){
          console.log(err);
          res.send("Something went wrong when trying to create your account.\nPlease try again.");
        });
      });
    });
  },

  logout: function( req, res ) { // Destroys session
    res.clearCookie('connect.sid');
    req.session.destroy(function(err){
      res.redirect('/');
    });
  },

  getAllProfiles: function( req, res, next ){
    User.findAll()
    .then(function (teamProfiles) {
      res.json(teamProfiles);
    });
  },

  getOwnProfile: function(req, res){
    User.findById(req.session.passport.user)
    .then(function(data){
      var obj = data;
      obj.username = "";
      obj.hash = "";
      if((data.temp.updatedAt + (1000 * 60 * 5)) < Date.now() && data.games.verified) { //5 minute timer between api call pairs
        obj.temp.updatedAt = Date.now();
        relay('https://' + data.games.region + '.api.pvp.net/api/lol/' + data.games.region + '/v2.2/matchhistory/' + data.games.id + '?api_key=' + config.lolapi, function(err, history){
          if(history && JSON.stringify(history).length === 4){
            obj.temp.matches = [];
          } else if (history) {
            JSON.parse(history).matches.forEach(function(val, i){
              obj.temp.matches[i] = {champ: val.participants[0].championId, win: val.participants[0].stats.winner};
            });
          }
          relay('https://' + data.games.region + '.api.pvp.net/api/lol/' + data.games.region + '/v2.5/league/by-summoner/' + data.games.id + '?api_key=' + config.lolapi, function(err, league){
            if(league){
              obj.temp.rank = JSON.parse(league)[data.games.id][0].tier;
              User.update({temp: obj.temp}, {where: {id: req.session.passport.user}})
              .then(function(one, two){
                res.json(obj);
              });
            } else {
              obj.temp.rank = "unranked";
              User.update({temp: obj.temp}, {where: {id: req.session.passport.user}})
              .then(function(one, two){
                res.json(obj);
              });
            }
          });
        });
      } else {
        res.json(obj);
      }
    });
  },

  getTeamsOwned: function(req, res){ // sends profiles of teams they captain
    var myTeams = [];
    User.findById(req.session.passport.user)
    .then(function(data){
      var teamsArray = data.teams;
      Team.findAll({
        where: {
          teamCaptain: req.session.passport.user
        }
      }).then(function(data){
        res.json(data);
      });
    });
  },

  updateBio: function(req, res){ // Updates bio data
    User.findById(req.session.passport.user)
    .then(function(data){
      deepBoolean(req.body);
    })
    .then(function(){
      User.update({bio: req.body},{where: {id: req.session.passport.user}});
    })
    .then(function(){
      res.redirect('/');
    });
  },

  updateSettings: function(req, res){ // Updates account data
    User.findById(req.session.passport.user)
    .then(function(data){
      bcrypt.compare(req.body.confirm, data.hash, function(err, verified){
        if(verified){
          if(req.body.email.length > 0){
            User.update({username: req.body.email}, {where: {id: data.id}});
          }
          if(req.body.pass1.length > 0){
            bcrypt.genSalt(10, function(err, salt){
              bcrypt.hash(req.body.pass1, salt, function(err, hash){
                User.update({hash: hash}, {where: {id: data.id}});
              });
            });
          }
        } else {
          res.send("You supplied the incorrect password");
        }
      });
    })
    .then(function(){
      res.clearCookie('connect.sid');
      req.session.destroy(function(err){
        res.redirect('/');
      });
    });
  },

  setSummoner: function(req, res){
    var key = "", obj = {}, region = req.body.region.toLowerCase(), name = req.body.name.toLowerCase().replace(' ', '');
    for(var i = 0; i < 20; i++){
      key += gen.charAt(Math.floor(Math.random()*62));
    }
    relay('https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + name + '?api_key=' + config.lolapi, function(er, data) {
      obj.id = JSON.parse(data)[name].id;
      obj.name = JSON.parse(data)[name].name;
      obj.level = JSON.parse(data)[name].summonerLevel;
      obj.avatar = 'http://avatar.leagueoflegends.com/' + region + '/' + name + '.png';
      obj.region = req.body.region.toLowerCase();
      obj.verified = false;
      obj.verifyKey = key;
      obj.verifyRoute = "https://" + obj.region + ".api.pvp.net/api/lol/" + obj.region + "/v1.4/summoner/" + obj.id + "/runes?api_key=" + config.lolapi;
      User.update({displayName: obj.name + ' (unverified)', games: obj}, {where: {id: req.session.passport.user}})
      .then(function(){
        res.redirect('/#/account-link');
      });
    });
  },

  verifySummoner: function(req, res){
    User.findById(req.session.passport.user)
    .then(function(data){
      var obj = data.games;
      var name = data.displayName.split(' (')[0];
      var temp = data.temp;
      temp.updatedAt = 0;
      relay(obj.verifyRoute, function(err, body){
        if(JSON.parse(body)[obj.id].pages[0].name === obj.verifyKey || config.autoauth){ //TODO: Remove autoauth
          obj.verified = true;
          obj.verifyKey = false;
          obj.verifyRoute = false;
          User.update({displayName: name, games: obj, temp: temp}, {where: {id: req.session.passport.user}})
          .then(function(){
            res.redirect('/#/account-link');
          });
        } else {
          res.send("Verification failed. It may take a moment for Riot to update their servers,\n but please check to see that the name of your first rune page is: " + obj.verifyKey);
        }
      });
    });
  },

  updateSummoner: function(req, res){ // Updates game data
    var user;
    User.findById(req.session.passport.user)
    .then(function(info){
      user = info.games;
      relay('https://' + user.region + '.api.pvp.net/api/lol/' + user.region + '/v1.4/summoner/' + user.id + '?api_key=' + config.lolapi, function(er, data) {
        user.name = JSON.parse(data)[user.id].name;
        user.level = JSON.parse(data)[user.id].summonerLevel;
        User.update({games: user}, {where: {id: req.session.passport.user}})
        .then(function(){
          res.redirect('/#/account-link');
        });
      });
    });
  },

  updateRatings: function(req, res){ // Updates ratings data
    User.findById(req.session.passport.user)
    .then(function(data){
      User.update({
        ratings: req.body.ratings,
        counter: req.body.counter,
        answerHistory: req.body.answerHistory
      },{where: {id: req.session.passport.user}});
    });
  },

  // Functions that retrieve other user information - more sanitized results

  profileByName: function(req, res, name){
    User.findOne({where: {displayName: name}})
    .then(function(data){
      var obj = data;
      obj.username = false; // hides user's email
      obj.hash = false; // hide's user's hashed password
      res.json(obj);
    });
  },

  profileById: function(req, res, id){
    User.findById(id)
    .then(function(data){
      var obj = data;
      obj.username = false; // hides user's email
      obj.hash = false; // hide's user's hashed password
      res.json(obj);
    });
  },

  getChampList: function(req, res, cb){
    relay('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=' + config.lolapi, function(err, list){
      var obj = {};
      list = JSON.parse(list).data;
      for(var champ in list){
        obj[champ.id] = champ;
      }
      cb(obj);
    });
  }
};

function relay(url, callback) {
  console.log('---API CALL---'); //to keep track of api calls in dev environment
  request(url, function(err, stat, body) {
    if(err) {
      callback(err, null);
    } else if(stat.statusCode < 200 || stat.statusCode >= 400) {
      console.log("Status Code: " + stat.statusCode + " at: " + url);
      if(stat.statusCode === 404 || stat.statusCode >= 500){ 
        callback(null, false);
      } //handles requests for info that doesn't exist if that happens
    } else {
      callback(null, body);
    }
  });
}

function deepBoolean(obj){
  if(typeof obj !== 'object') {
    if(obj === 'true' || obj === 'false'){
      return obj === 'true';
    }
  }
  if (Array.isArray(obj)) {
    obj.forEach(function(val){
      return deepBoolean(val);
    });
  } else if (typeof obj === 'object') {
    for (var key in obj){
      obj[key] = deepBoolean(obj[key]);
    }
  }
  return obj;
}
