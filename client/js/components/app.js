var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var Header = require('../components/header/app-header');

var App = React.createClass({

  getInitialState: function() {
    return {
      userId: 0,
      displayName: "",
      avatar: "",
      bio: {
        times: [],
        purpose: [],
        roles: [],
        lanes: []
      },
      teams: [],
      games: {},
      counter: 0,
      answerHistory: [],
      ratings: {},
      temp: {
        rank: "unranked",
        matches: []
      }
    };
  },

  componentDidMount: function() {
    var context = this;
    $.get('/profile', function(response){
      context.setState({
        userId: response.id,
        displayName: response.displayName,
        avatar: response.games.avatar,
        //the rest are full objects
        bio: response.bio,
        teams: response.teams,
        games: response.games,
        counter: response.counter, //can we remove this eventually, can this be put in ratings?
        answerHistory: response.answerHistory,
        ratings: response.ratings,
        temp: response.temp
      })
    })
  },

  render: function() {
    return (
      <div className="app">
        <Header displayName={this.state.displayName} avatar={this.state.avatar} teams={this.state.teams} />
        <div className="container">
          <RouteHandler
          userId={this.state.userId}
          displayName={this.state.displayName}
          avatar={this.state.avatar}
          bio={this.state.bio}
          teams={this.state.teams}
          games={this.state.games}
          counter={this.state.counter}
          answerHistory={this.state.answerHistory}
          ratings={this.state.ratings}
          temp={this.state.temp}
          />
        </div>
      </div>
    );
  }
});

module.exports = App;
