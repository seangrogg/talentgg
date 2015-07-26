/* THIS IS WHERE OUR INDEX LOOKS TO MOUNT OUR APP.
 * WE ALSO PROVIDE ALL THE ROUTES USING REACT ROUTER  */

var React = require('react');
var Router = require('react-router');
var routes = require('./routes');

var router = Router.create({
  routes: routes,
  location: null // Router.HistoryLocation
});

router.run(function (Handler, state) {
  React.render(<Handler/>, document.body);
});
