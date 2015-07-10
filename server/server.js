var express = require( 'express' );
var path = require( 'path' );
var app = express();
var port = process.env.PORT || 3000;

app.set( 'views', path.join( __dirname, "views" ) );
app.set( 'view engine', 'ejs' );

//add user specific routes
require( './routes/userroutes.js' )( app );
// require( './routes/teamroutes.js' )( app );

app.listen( port );
console.log( 'Listening on port ' + port );