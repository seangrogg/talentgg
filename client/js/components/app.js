/* THIS IS THE ROOT VIEW THAT GETS MOUNTED TO REACT ROUTER
*  IT ALSO RENDERS THE HEADER WHICH HAS ACCESS TO OUR SESSION STATE THROUGH SESSIONSTORE
*  THIS LETS US DYNAMICALLY UDPATE OUR HEADER.
*
*  EXAMPLE: IF A USER IS LOGGED IN, WE WOULD NOT SHOW THEM THE LOGIN OR SIGNUP OPTIONS
*           WE WOULD SHOW THEM SOME RELEVANT USER DATA WITHIN THE HEADER
*  */


var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var Header = require('../components/header/app-header');




var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        <Header />
        <div className="container">
          <RouteHandler/>
        </div>
      </div>
    );
  }

});

module.exports = App;
