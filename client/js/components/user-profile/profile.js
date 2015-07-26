var React = require('react');
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Bio = require('./bio');
var BioForm = require('./bio-form');
var Axios = require('axios');
var Ratings = require('./ratings.js')

var rd3 = require('react-d3');
var BarChart = rd3.BarChart;

var Profile = React.createClass({
  mixins: [Router.State],
  getInitialState: function() {
    return {
      bio: {
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
        about: "",
        favorite: "",
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
        }
      },
      userquestions: [],
      displayName: '',
      games: {},
      temp: {
        rank: "unranked",
        matches: []
      },
      ratings: {
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
    };
  },
  componentDidMount: function() {
    var context = this;
    Axios.get('/profile').
      then(function(response) {
        context.setState({
          bio: response.data.bio,
          displayName: response.data.displayName,
          ratings: response.data.ratings,
          games: response.data.games,
          temp: response.data.temp
        });
      });
  },

  render: function() {
    return (
      <div>
        <Bio displayName={this.state.displayName} bio={this.state.bio} games={this.state.games} temp={this.state.temp} />

        <Ratings stats={this.state.ratings} />
      </div>
    );
  }
});

module.exports = Profile;
