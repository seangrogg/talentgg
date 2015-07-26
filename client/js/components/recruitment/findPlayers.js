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

var rd3 = require('react-d3');
var LineChart = rd3.LineChart;

var RecUtil = require('../../utils/recUtil.js');


var FindPlayers = React.createClass({
  getInitialState: function() {
    return {
      users: [],
      teamIDs: [],
      myTeams: [],
      allTeams: [],
      filteredUsers: [],
      me: {},   
      displayName: "solo",   
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
      id: 0,
      searchAs: "solo"
    };
  },
  componentWillMount: function() {
    var context = this;

    axios.all([axios.get('/user/all'), axios.get('/profile'), axios.get('/profile/teams'), axios.get('/team/all')])
        .then(axios.spread(function(them, me, myTeams, allTeams) {           
            context.setState({
              users: them.data,
              filteredUsers: them.data,
              me: me.data.ratings,
              id: me.data.id,
              myTeams: myTeams.data,
              displayName: me.data.displayName,
              allTeams: allTeams.data
            });
        }));
  },

  handleChange: function(e) {    
    this.setState({
      searchAs: e.value
    });
  },
  render: function() {
    var context = this;
    var teamsCaptained = RecUtil.teamsCaptained(context.state.myTeams, context.state.id);

    return (     
      <div className="findPlayers">
       
          <form onSubmit={this.handleSubmit}>

            <Select onUpdate={this.handleChange} >              
              <Option value="solo">search individuals as myself</Option>
              <Option value="team">search teams as myself</Option>              
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

          </form>

        <MatchList users={this.state.users} teams={this.state.allTeams} me={this.state.me}
        id={this.state.id} searchAs={this.state.searchAs} times={this.state.times} purpose={this.state.purpose}
        roles={this.state.roles} lanes={this.state.lanes} />    
      </div>
      );
  }
});

module.exports = FindPlayers;

var MatchList = React.createClass({  

  render: function() {
    
    var userSubset = this.props.users;
    userSubset = RecUtil.checkIfChecked(this.props.times) ? RecUtil.propFilter(userSubset, "times", this) : userSubset;
    userSubset = RecUtil.checkIfChecked(this.props.purpose) ? RecUtil.propFilter(userSubset, "purpose", this) : userSubset;
    userSubset = RecUtil.checkIfChecked(this.props.roles) ? RecUtil.propFilter(userSubset, "roles", this) : userSubset;
    userSubset = RecUtil.checkIfChecked(this.props.lanes) ? RecUtil.propFilter(userSubset, "lanes", this) : userSubset;

    var context = this;

    var MatchNodes = [];
    var matchOrder = [];
    var overallScore;
    var matchData;
    
    matchData = this.props.searchAs === "solo" ? userSubset : this.props.teams;

    // do the same for myratings if they pick a team

    _.map(matchData, function(data) {
      overallScore = 0;
      if (data.id !== context.props.id) {
        for (key in context.props.me) {
          var score = 20 - Math.abs(context.props.me[key] - data.ratings[key]);
          overallScore += score;
          score = RecUtil.calculateMatchScore(score, 20);
        }
        overallScore = Math.round(RecUtil.calculateMatchScore(overallScore, 200) * 100);
        data.overallScore = overallScore;
        matchOrder.push(data);
      }    
    });

    _.map(matchOrder, function(match) {
      match.link = '/#/user/' + match.displayName
      if (!match.games) {        
        match.games = {
          avatar: "http://sener.is/hat.jpg"
        }
        match.bio = match.profile
        match.displayName = match.profile.teamName
        match.link = '/#/team/' + match.displayName
        console.log(match);
      }

      if (isNaN(match.overallScore)) {
        console.log("NaN error")
        console.log(match);
        match.overallScore = 0;
        }
      });
      matchOrder = _.sortBy(matchOrder, function(match) {
        return match.overallScore;
      }).reverse();
      _.map(matchOrder, function(match) {
      var lineData = [{
        name: "me",
        values: []
      }, {
        name: "them",
        values: []
      }];
      var counter = 0;

      for (var key in context.props.me) {
        lineData[0].values.push({
          x: counter,
          y: Number(context.props.me[key])
        });
        lineData[1].values.push({
          x: counter,
          y: Number(match.ratings[key])
        });
        counter++;
      }

      MatchNodes.push(
        <div className="row" style={RecUtil.whiteBox}>
            <div className="row" style={RecUtil.headshot}>
              <img className="img-circle center-block" src={match.games.avatar}/>
              <a href={match.link}> <div align="center"> { match.displayName } </div> </a>              
              <div> {match.overallScore}% </div>
            </div>
            <div className="row" style={RecUtil.stats}>
              <div> { RecUtil.arrayToString(match.bio.purpose) } </div>    
              <div> { RecUtil.arrayToString(match.bio.times) } </div>
              <div> { RecUtil.arrayToString(match.bio.roles) } </div>
              <div> { RecUtil.arrayToString(match.bio.lanes) } </div>              
              <br />
              <br />
            </div>
            <div className="row">
              <LineChart className="row" style={RecUtil.chart}
                legend={false}
                data={lineData}
                width={250}
                height={200}
                title=""
              />
            </div>
        </div>
      )
    });

    return (
      <div>
        <ul className="MatchList">
          {MatchNodes}
        </ul>          
      </div>
    );
  }
});
