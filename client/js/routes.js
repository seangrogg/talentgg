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
var UserProfile = require("./components/user-profile/viewProfile");
var Profile = require("./components/user-profile/profile");
var UserQuestions = require("./components/user-profile/user-questions");
var BioForm = require("./components/user-profile/bio-form");
var FindPlayers = require("./components/recruitment/findPlayers");
var AccountLink = require("./components/user-profile/accountLink");
var TeamRegistration = require("./components/team/team-registration");
var TeamProfile = require("./components/team/team-profile");
var TeamUpdateForm = require("./components/team/team-update-form");
var Settings = require("./components/user-profile/settings");

var Test = require("./components/user-profile/test");

var NotFound = React.createClass({
  render: function () {
    return <h2>NOT FOUND</h2>;
  }
});

module.exports = (

  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Test} />
    <Route name="profile" path="/profile" handler={Test}/>
    <Route name="user-profile" path="/user/:username" handler={UserProfile}/>
    <Route name="userquestions" path="/userquestions" source="/questions" handler={UserQuestions}/>
    <Route name="findplayers" path="/findplayers" handler={FindPlayers}/>
    <Route name="bioform" path="/bioform" handler={BioForm}/>
    <Route name="accountLink" path="/account-link" handler={AccountLink}/>
    <Route name="teamregistration" path="/teamregistration" handler={TeamRegistration}/>
    <Route name="teamprofile" path="/team/:teamname" handler={TeamProfile}/>
    <Route name="teamupdateform" path="/teamupdate" handler={TeamUpdateForm}/>
    <Route name="settings" path="/settings" handler={Settings}/>
    <Route name="test" path="/test" handler={Test}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>

);
