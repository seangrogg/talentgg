var React = require('react');
var axios = require('axios');

var _ = require('lodash');

var ReactBtn = require('react-btn-checkbox');
var Checkbox = ReactBtn.Checkbox;

var belle = require('belle');
Button = belle.Button;
Select = belle.Select;
Option = belle.Option;
Separator = belle.Separator;

var whiteBox = {backgroundColor: 'white', padding: '25', margin:'25', border: 'solid black 2px', height: '250', width: '450', display: 'inline-block'};
var headshot = {backgroundColor: 'white', padding: '10', border: 'solid red 2px', height: '200', width: '200', float: 'left', textAlign: 'center'};
var stats = {backgroundColor: 'white', padding: '25', border: 'solid blue 2px', height: '200', width: '200', display: 'block', float: 'right', textAlign: 'center'};

var FindPlayers = React.createClass({
  getInitialState: function() {
    return {
      users: [],
      teamIDs: [],
      teams: [],
      filteredUsers: [],
      me: {},      
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
      id: 0
    };
  },
  componentWillMount: function() {
    var context = this;

    function getThem() {
        return axios.get('/user/all');
    }

    function getMe() {
        return axios.get('/profile');
    }

    axios.all([getThem(), getMe()])
        .then(axios.spread(function(them, me) { 
            context.setState({
              users: them.data,
              filteredUsers: them.data,
              me: me.data.ratings,
              id: me.data.id,
              teamIDs: me.data.teams           
            })
        .then(axios.get('/'))

          ;
        }));
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var checkIfChecked = function(obj) {            
      return !(_.every(obj, function(elm) {
        return elm === false;
      }) || _.every(obj, function(elm) {
        return elm === true;
      }));      
    };

    var filterByProperty = function(userList, property, context) {
      var filters = [];

      for (var key in context.state[property]) {
        if (context.state[property][key] === true) filters.push(key);        
      }
      return _.filter(userList, function(user) {
        var filterTest = false;
        _.map(filters, function(elm) {          
          if (user.bio[property][elm] === true) {
            filterTest = true;
          }
        });        
        return filterTest;
      });      
    };

    var userSubset = this.state.users;

    if (checkIfChecked(this.state.times) === true) {
      userSubset = filterByProperty(userSubset, "times", this);
    }

    if (checkIfChecked(this.state.purpose) === true) {
      userSubset = filterByProperty(userSubset, "purpose", this);
    }

    if (checkIfChecked(this.state.roles) === true) {
      userSubset = filterByProperty(userSubset, "roles", this);
    }

    if (checkIfChecked(this.state.lanes) === true) {
      userSubset = filterByProperty(userSubset, "lanes", this);
    }

    this.setState({
      filteredUsers: userSubset
    });
  },
  render: function() {
    var context = this;
    var teamsCaptained = (function() {
      var teamNodes = [];

      for (var i = 0; i < context.state.teams.length; i++) {
        if (context.state.teams[i].teamCaptain === context.state.id) {
          console.log(context.state.teams[i].teamName);
          teamNodes.push(
            <Option value={context.state.teams[i].teamName}>{context.state.teams[i].teamName}</Option>
          )
        }
      }
      return teamNodes
    })()
    console.log(teamsCaptained.length);

    return (     
      <div className="findPlayers">
        <h1> Matches </h1>
        <h2> Filters </h2>
       
          <form onSubmit={this.handleSubmit}>

            <Select>
              <Option value="solo">Solo</Option>
              <Separator>Teams You Captain</Separator>
              {teamsCaptained}
            </Select>
          
            <Checkbox
            label='Times: '
            options={this.state.times}
            onChange={this.setState.bind(this)}
            bootstrap />

            <Checkbox
            label='Roles: '
            options={this.state.purpose}
            onChange={this.setState.bind(this)}
            bootstrap />

            <Checkbox
            label='Roles: '
            options={this.state.roles}
            onChange={this.setState.bind(this)}
            bootstrap />

            <Checkbox
            label='Lanes: '
            options={this.state.lanes}
            onChange={this.setState.bind(this)}
            bootstrap />
            
            <Button primary type="submit" value="Submit">Submit</Button>

          </form>

          


        <MatchList users={this.state.filteredUsers} me={this.state.me} id={this.state.id} />    
      </div>
      );
  }
});

module.exports = FindPlayers

var MatchList = React.createClass({  

  render: function() {
    var arrayToString = function(obj) {
      var string = [];
      for (var key in obj) {
        if (obj[key] === true) {
          string.push(key);
        }
      }
      return string.toString();
    };

    var calculateMatchScore =  function(pos, n) {
      var z, phat;      
      z = 1.56;  // 1.96 = 95%
      phat = 1 * pos / n;
      return (phat + z*z/(2*n) - z * Math.sqrt((phat*(1-phat)+z*z/(4*n))/n))/(1+z*z/n); 
    };
    var MatchNodes = [];
    var matchOrder = [];
    var overallScore;
    
    for (var i = 0; i < this.props.users.length; i++){
      overallScore = 0;
      if (this.props.users[i].id !== this.props.id) {
        for (key in this.props.me) {          
          var score = 20 - Math.abs(this.props.me[key] - this.props.users[i].ratings[key]);
          overallScore += score;
          score = calculateMatchScore(score, 20);        
        };
        overallScore = Math.round(calculateMatchScore(overallScore, 200) * 100);
        this.props.users[i].overallScore = overallScore;        
        matchOrder.push(this.props.users[i]);
      }
    }
    _.map(matchOrder, function(user) {
      if (isNaN(user.overallScore)) {
        console.log("NaN error")
        console.log(user);
        user.overallScore = 0;
      }
    });
    matchOrder = _.sortBy(matchOrder, function(user) {      
      return user.overallScore;
    }).reverse();

    _.map(matchOrder, function(user) {
      MatchNodes.push(
        <div className="row" style={whiteBox}>
            <div className="row" style={headshot}>
              <img className="img-circle center-block" src={user.games.avatar}/>
              <div align="center"> { user.displayName } </div>
              <div> {user.overallScore}% </div>
            </div>
            <div className="row" style={stats}>
              <div> does this work? </div>
              <div> { arrayToString(user.bio.willdo) } </div>
              <div> { arrayToString(user.bio.purpose) } </div>    
              <div> { arrayToString(user.bio.times) } </div>
              <br />
              <br />
            </div>
        </div>
      )
    })
    
    return (
      <div>
        <ul className="MatchList">
          {MatchNodes}
        </ul>          
      </div>
    );
  }
});
