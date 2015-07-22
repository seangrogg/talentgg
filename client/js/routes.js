/*
 OUR ROUTES ARE NOW DEFINED WITH THIS FILE.
 THIS HELPS USE MAINTAIN ALL OUR ROUTES WITHIN
 ONE FILE & IT MAKES MAIN.JS MORE READABLE.
 */


var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

/* COMPONENTS TO RENDER DEPENDING ON THE REQUESTED ROUTE */

var App = require("./components/app");
var About = require("./components/about/app-about");
var UserProfile = require("./components/user-profile/profile");
var Profile = require("./components/user-profile/profile");
var UserQuestions = require("./components/user-profile/user-questions");
var BioForm = require("./components/user-profile/bio-form");
var FindTeams = require("./components/recruitment/findTeams");
var Settings = require("./components/user-profile/settings");
var TeamRegistration = require("./components/team/team-registration");
var NotFound = React.createClass({
  render: function () {
    return <h2>NOT FOUND</h2>;
  }
});

module.exports = (

  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={UserProfile} />
    <Route name="user-profile" path="/user-profile/:username" handler={UserProfile}/>
    <Route name="profile" path="/user-profile" handler={Profile}/>
    <Route name="userquestions" path="/userquestions" source="/questions" handler={UserQuestions}/>
    <Route name="findteams" path="/findteams" handler={FindTeams}/>
    <Route name="bioform" path="/bioform" handler={BioForm}/>
    <Route name="settings" path="/settings" handler={Settings}/>
    <Route name="teamregistration" path="/teamregistration" handler={TeamRegistration}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>

);
