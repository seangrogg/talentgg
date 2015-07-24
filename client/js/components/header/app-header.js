/* OUR HEADER INHERITS PROPS FROM OUR MAIN APP COMPONENT
 * THIS LETS IT ACCESS THE SESSIONSTORE TO CHECK IF SOMEONE IS LOGGED IN.
 * IF THEY ARE NOT LOGGED IN WE DISPLAY LOGIN OR SIGNUP.
 * IF THEY ARE LOGGED IN WE WOULD DISPLAY SOMETHING CUSTOM,
 * HAVE A PLACE HOLDER CURRENTLY
 */

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var ReactPropTypes = React.PropTypes;

var Header = React.createClass({

  getInitialState: function(){
    return {
      displayName: "",
      teams: []
      //dummy data below
      // teams: [{id: 1, teamName: "pew pew"}, {id:2, teamName: "win factory"}, {id:3, teamName: "scrub life"}]
    }
  },

  componentDidMount: function(){
    $.get('/profile', function(result){
      if(this.isMounted()){
        this.setState({
          displayName: result.displayName,
          teams: result.teams,
          image: result.games.avatar
        })
      }
    }.bind(this));
  },

  logout: function() {
    $.post('/logout', function(){
      location.reload();
    });
  },

  render: function() {
    return (
      <nav className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="/">Talent.gg</Link>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li><Link to="/userquestions"> <i className="fa fa-question" /> Questions</Link></li>
              <li><Link to="/findPlayers"><i className="fa fa-user-plus" /> Find Players </Link></li>
              <li><Link to="/findTeams"><span className="glyphicon glyphicon-search"></span> Find Teams </Link></li>
              <li className="dropdown">
                <Link to='/' className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> <i className="fa fa-users" /> My Teams <span className="caret"></span></Link>
                <ul className="dropdown-menu">
                  { this.state.teams.map(function(team){ return <li key={team.id}><Link to={"/team/" + team.teamName} > {team.teamName} </Link></li> })}
                  { this.state.teams.length < 3 ? (<li><Link to="/teamregistration"> Create a Team </Link></li>) : null }
                </ul>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><Link to="profile"><image className="img-rounded" height="20px" width="20px" src={this.state.image} /> {this.state.displayName}</Link></li>
              <li><Link to="/" style={{fontSize: '20px'}}><span className="glyphicon glyphicon-envelope"></span></Link></li>
              <li className="dropdown">
                <Link to='/' style={{fontSize: '20px'}} className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span className="glyphicon glyphicon-cog"></span></Link>
                <ul className="dropdown-menu">
                  <li><Link to="accountLink">Account Link</Link></li>
                  <li><Link to="settings">Settings</Link></li>
                  <li role="separator" className="divider"></li>
                  <li><Link to="/" onClick={this.logout}>Logout</Link></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Header;
