var express = require('express');
var app = express();
var config = require('./config/config');
require('./config/auth')(app);

// Serving static files from dist folder

app.use(express.static(__dirname + '/../dist', {index: false}));

// Default Routes

// Determines which main page to render based on session status
app.get('/', function(req, res) {
  if(req.session.passport.user){
    res.sendFile('main.html', {root: 'dist'});
  } else {
    res.sendFile('index.html', {root: 'dist'});
  }
});

// Prevents accidentally using React routes if no session is held
app.get(/\/#\/.*/, function(req, res) {
  if(!req.session.passport.user){
    res.sendFile('index.html', {root: 'dist'});
  }
});

//API Routes
require('./routes/user.routes.js')(app);
require( './routes/team.routes.js' )( app );
require('./routes/questions.routes.js')(app);

//Initialization
app.listen(config.port);
console.log('Listening on port ' + config.port);
