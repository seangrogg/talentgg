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
          })
        })
        .catch(function(err){
          console.log(err);
          res.send("Something went wrong when trying to create your account.\nPlease try again.")
        });
      })
    })
  },

  logout: function( req, res ) { // Destroys session
    res.clearCookie('connect.sid');
    req.session.destroy(function(err){
      res.redirect('/');
    })
  },

  getAllProfiles: function( req, res, next ){
    User.findAll()
    .then(function (teamProfiles) {
      res.json(teamProfiles)
    })
  },

  getOwnProfile: function(req, res){ // Retrieves own profile data
    User.findById(req.session.passport.user)
    .then(function(data){
      var obj = data;
      obj.hash = false; // this prevents retrieval of hashed password
      res.json(obj);
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
      User.update({bio: req.body},{where: {id: req.session.passport.user}})
    })
    .then(function(){
      res.redirect('/#/user-profile');
    })
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
              })
            })
          }
        } else {
          res.send("You supplied the incorrect password");
        }
      })
    })
    .then(function(){
      res.clearCookie('connect.sid');
      req.session.destroy(function(err){
        res.redirect('/');
      })
    })
  },

  setSummoner: function(req, res){
    var key = "", obj = {}, region = req.body.region.toLowerCase(), name = req.body.name.toLowerCase().replace(' ', '');
    for(var i = 0; i < 20; i++){
      key += gen.charAt(Math.floor(Math.random()*62));
    }
    relay(res, 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + name + '?api_key=' + config.lolapi, function(er, data) {
      obj.id = JSON.parse(data)[name].id;
      obj.name = JSON.parse(data)[name].name;
      obj.level = JSON.parse(data)[name].summonerLevel;
      obj.avatar = 'http://avatar.leagueoflegends.com/' + region + '/' + name + '.png';
      obj.region = req.body.region;
      obj.verified = false;
      obj.verifyKey = key;
      obj.verifyRoute = "https://" + obj.region + ".api.pvp.net/api/lol/" + obj.region + "/v1.4/summoner/" + obj.id + "/runes?api_key=" + config.lolapi;
      User.update({displayName: obj.name, games: obj}, {where: {id: req.session.passport.user}})
      .then(function(){
        res.redirect('/#/account-link');
      })
    })
  },

  verifySummoner: function(req, res){
    User.findById(req.session.passport.user)
    .then(function(data){
      var obj = data.games;
      relay(res, obj.verifyRoute, function(err, body){
        if(err) throw err;
        if(JSON.parse(body)[obj.id].pages[0].name === obj.verifyKey){
          obj.verified = true;
          obj.verifyKey = false;
          obj.verifyRoute = false;
          User.update({games: obj}, {where: {id: req.session.passport.user}})
          .then(function(){
            res.redirect('/#/user-profile');
          });
        } else {
          res.send("Verification failed. Check to see that the name of your first rune page is: " + obj.verifyKey);
        }
      })
    })
  },

  updateSummoner: function(req, res){ // Updates game data
    var user;
    User.findById(req.session.passport.user)
    .then(function(info){
      user = info.games;
      relay(res, 'https://' + user.region + '.api.pvp.net/api/lol/' + user.region + '/v1.4/summoner/' + user.id + '?api_key=' + config.lolapi, function(er, data) {
        user.name = JSON.parse(data)[user.id].name;
        user.level = JSON.parse(data)[user.id].summonerLevel;
        User.update({games: user}, {where: {id: req.session.passport.user}})
        .then(function(){
          res.redirect('/#/profile');
        })
      })
    })
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
    })
  },

  profileById: function(req, res, id){
    User.findById(id)
    .then(function(data){
      var obj = data;
      obj.username = false; // hides user's email
      obj.hash = false; // hide's user's hashed password
      res.json(obj);
    })
  },

  // Functions that call to external APIs

  lolapi: function(req, res, region, username){
    var obj = {}
      //first api call
    relay('https://' + region + '.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + username + '?api_key=' + config.lolapi, function(er, data) {
      obj.id = JSON.parse(data)[username].id;
      obj.name = JSON.parse(data)[username].name;
      obj.level = JSON.parse(data)[username].summonerLevel;
      obj.avatar = 'http://avatar.leagueoflegends.com/' + region + '/' + username + '.png';
      obj.region = region;
      //second api call
      request(res, 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.5/league/by-summoner/' + obj.id + '?api_key=' + config.lolapi, function(err, stat, body) {
        if(err) { throw err }
        else if(stat.statusCode === 404) {
          obj.rank = "unranked";
          res.json(obj);
        } else if(stat.statusCode < 200 || stat.statusCode >= 400) {
          console.log("Status Code: " + stat.statusCode);
        } else {
          obj.rank = JSON.parse(body)[obj.id][0].tier;
          res.json(obj);
        }
      });
    });
  }

};

function relay(res, url, callback) {
  request(url, function(err, stat, body) {
    if(err) {
      callback(err, null);
    } else if(stat.statusCode < 200 || stat.statusCode >= 400) {
      console.log("Status Code: " + stat.statusCode);
      res.send("It appears someone at Riot tripped over the power cord. Please try again soon =p");
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
};
