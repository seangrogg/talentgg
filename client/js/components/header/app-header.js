var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var ReactPropTypes = React.PropTypes;

var Header = React.createClass({

  propTypes: {
    displayName: React.PropTypes.string.isRequired,
    avatar: React.PropTypes.string.isRequired,
    teams: React.PropTypes.array.isRequired
  },

  logout: function() {
    $.post('/logout', function(){
      location.reload();
    });
  },

  render: function() {
    return (
      <nav id="mainNav" className="navbar navbar-fixed-top navbar-default">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="/"><object type="image/svg+xml" data="img/tgglogo.svg"></object></Link>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li><Link to="/findPlayers"><i className="fa fa-user-plus" /> Recruitment </Link></li>
              <li className="dropdown">
                <Link to='/' className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> <i className="fa fa-users" /> My Teams <span className="caret"></span></Link>
                <ul className="dropdown-menu">
                  { this.props.teams.map(function(team){ return <li key={team.id}><Link to={"/team/" + team.teamName} > {team.teamName} </Link></li> })}
                  { this.props.teams.length < 3 ? (<li><Link to="/teamregistration"> Create a Team </Link></li>) : null }
                </ul>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><Link to="profile"><image className="img-rounded" height="20px" width="20px" src={this.props.avatar} /> {this.props.displayName}</Link></li>
              <li><Link to="/" style={{fontSize: '20px'}}><i className="fa fa-envelope" /></Link></li>
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
