var React = require('react');
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var OtherBio = require('./otherBio');
var Axios = require('axios');

var viewProfile = React.createClass({
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
        },
      },
      userquestions: [],
      displayName: '',
      id: null,
      games: {},
      temp: {
        rank: "unranked",
        matches: []
      }
    };
  },
  componentDidMount: function() {
    var context = this;
    var pathname = window.location.href.split('user/')[1];
    console.log(pathname);
    Axios.get('/user/' + pathname).
      then(function(response) {
        console.log(response.data.displayName);
        context.setState({
          bio: response.data.bio,
          displayName: response.data.displayName,
          ratings: response.data.ratings,
          games: response.data.games,
          temp: response.data.temp
        });
      });
    this.router = this.context.router;
  },

  render: function() {
    console.log("VIEW PROFILE START");
    return (
      <OtherBio displayName={this.state.displayName} bio={this.state.bio} games={this.state.games} temp={this.state.temp} id={this.state.id} />
    );
  }
});

module.exports = viewProfile;

//         <div className="col-md-12">
//            <UserQuestions username={username} questions={this.state.userquestions} profile={this.state.ratings} counter={this.state.counter} />
//         </div>
