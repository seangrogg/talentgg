var React = require('react');
var Router = require("react-router");
var Route = Router.Route;
var Ratings = require('./ratings');
var Questions = require('./user-questions');
var Edit = require('./bio-form')

var champList = {"1":"Annie","2":"Olaf","3":"Galio","4":"TwistedFate","5":"XinZhao","6":"Urgot","7":"Leblanc","8":"Vladimir",
"9":"FiddleSticks","10":"Kayle","11":"MasterYi","12":"Alistar","13":"Ryze","14":"Sion","15":"Sivir","16":"Soraka","17":"Teemo",
"18":"Tristana","19":"Warwick","20":"Nunu","21":"MissFortune","22":"Ashe","23":"Tryndamere","24":"Jax","25":"Morgana","26":"Zilean",
"27":"Singed","28":"Evelynn","29":"Twitch","30":"Karthus","31":"Chogath","32":"Amumu","33":"Rammus","34":"Anivia","35":"Shaco",
"36":"DrMundo","37":"Sona","38":"Kassadin","39":"Irelia","40":"Janna","41":"Gangplank","42":"Corki","43":"Karma","44":"Taric","45":"Veigar",
"48":"Trundle","50":"Swain","51":"Caitlyn","53":"Blitzcrank","54":"Malphite","55":"Katarina","56":"Nocturne","57":"Maokai","58":"Renekton",
"59":"JarvanIV","60":"Elise","61":"Orianna","62":"MonkeyKing","63":"Brand","64":"LeeSin","67":"Vayne","68":"Rumble","69":"Cassiopeia",
"72":"Skarner","74":"Heimerdinger","75":"Nasus","76":"Nidalee","77":"Udyr","78":"Poppy","79":"Gragas","80":"Pantheon","81":"Ezreal",
"82":"Mordekaiser","83":"Yorick","84":"Akali","85":"Kennen","86":"Garen","89":"Leona","90":"Malzahar","91":"Talon","92":"Riven",
"96":"KogMaw","98":"Shen","99":"Lux","101":"Xerath","102":"Shyvana","103":"Ahri","104":"Graves","105":"Fizz","106":"Volibear","107":"Rengar",
"110":"Varus","111":"Nautilus","112":"Viktor","113":"Sejuani","114":"Fiora","115":"Ziggs","117":"Lulu","119":"Draven","120":"Hecarim",
"121":"Khazix","122":"Darius","126":"Jayce","127":"Lissandra","131":"Diana","133":"Quinn","134":"Syndra","143":"Zyra","150":"Gnar",
"154":"Zac","157":"Yasuo","161":"Velkoz","201":"Braum","222":"Jinx","236":"Lucian","238":"Zed","245":"Ekko","254":"Vi","266":"Aatrox",
"267":"Nami","268":"Azir","412":"Thresh","421":"RekSai","429":"Kalista","432":"Bard","223":"TahmKench"};

var Test = React.createClass({
  propTypes: {
    displayName: React.PropTypes.string.isRequired,
    avatar: React.PropTypes.string.isRequired,
    bio: React.PropTypes.object.isRequired,
    games: React.PropTypes.object.isRequired,
    temp: React.PropTypes.object.isRequired,
    ratings: React.PropTypes.object.isRequired
  },

  render: function() {
    var fitting = {height: 'auto', width: '100%'};

    var arrayToString = function(obj) {
      var arr = [];
      for (var key in obj) {
        if (obj[key] === true) {
          arr.push(key);
        }
      }
      return arr.join(', ');
    };

    var available = arrayToString(this.props.bio.times);
    var gameTypes = arrayToString(this.props.bio.purpose);
    var roleArray = arrayToString(this.props.bio.roles);
    var laneArray = arrayToString(this.props.bio.lanes);
    var games = this.props.temp.matches.reverse();
    var recentTop = games.slice(0, Math.min(5, games.length));
    var recentBot = games.length > 4 ? games.slice(5) : [];

    return(
      <div>
        <div className="row" id="whitebox">
          <div className="col-sm-offset-1 col-sm-2">
            <img className="img-circle center-block" width="128" height="128" src={this.props.avatar} />
          </div>
          <div className="col-sm-4">
            <h3>{this.props.displayName}</h3>
            <p>{this.props.bio.about}</p>
          </div>
          <div className="col-sm-2">
            <img className="center-block" width="128" height="128" src={"/img/tier-" + this.props.temp.rank + ".png"} />
          </div>
          <div className="col-sm-2">
            <img className="center-block" width="128" height="128" src="/img/role-support.png"/>
          </div>
        </div>
        <div className="row">
          <ul className="nav nav-pills nav-justified" role="tablist">
            <li role="presentation" className="active"><a href="#profile" aria-controls="profile" role="tab" data-toggle="pill">Profile</a></li>
            <li role="presentation"><a href="#edit" aria-controls="edit" role="tab" data-toggle="pill">Edit</a></li>
            <li role="presentation"><a href="#questions" aria-controls="questions" role="tab" data-toggle="pill">Questions</a></li>
            <li role="presentation"><a href="#chart" aria-controls="chart" role="tab" data-toggle="pill">Chart</a></li>
          </ul>
        </div>
        <div className="tab-content">
          <div role="tabpanel" className="tab-pane active" id="profile">
            <div className="row">
              <div className="col-sm-6">
                <div className="panel panel-default" id="whitebox">
                  <div className="panel-body">
                    <h3 className="text-center">Profile</h3>
                    <p><b>Available</b>: { available === "" ? 'Not available' : available}</p>
                    <p><b>Game Types</b>: { gameTypes === "" ? 'Not available' : gameTypes}</p>
                    <p><b>Roles</b>: { roleArray === "" ? 'No roles' : roleArray}</p>
                    <p><b>Lanes</b>: { laneArray === "" ? 'No lanes' : laneArray}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="panel panel-default" id="whitebox">
                  <div className="panel-body">
                    <h3 className="text-center">Ranked Games</h3>
                    <br/>
                    <div className="row">
                      <div className="col-sm-1"></div>
                      {recentTop.map(function(val, i){ return <div key={i} className="col-sm-2"><img className="img-circle" style={fitting} src={'http://ddragon.leagueoflegends.com/cdn/5.13.1/img/champion/' + champList[val.champ] + '.png'} /></div> })}
                    </div>
                    <br/>
                    <div className="row">
                      <div className="col-sm-1"></div>
                      {recentBot.map(function(val, i){ return <div key={i} className="col-sm-2"><img className="img-circle" style={fitting} src={'http://ddragon.leagueoflegends.com/cdn/5.13.1/img/champion/' + champList[val.champ] + '.png'} /></div> })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div role="tabpanel" className="tab-pane" id="edit">
            <Edit />
          </div>
          <div role="tabpanel" className="tab-pane" id="questions">
            <Questions />
          </div>
          <div role="tabpanel" className="tab-pane" id="chart">
            <Ratings stats={this.props.ratings} />
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Test;

/*

*/
