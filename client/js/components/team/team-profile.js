var React = require('react');
var Router = require('react-router');
var Axios = require('axios');

var whiteBox = {backgroundColor: 'white', paddingTop: '10', paddingBottom: '10', margin:'0', border: 'none'};

var TeamProfile = React.createClass({
  mixins: [Router.State, Router.Navigation],
  propTypes: {
    game: React.PropTypes.object.isRequired,
    members: React.PropTypes.object.isRequired,
    teamBio: React.PropTypes.object.isRequired,
    teamName: React.PropTypes.string.isRequired
  },
  getInitialState: function () {
    return {};
  },
  componentDidMount: function () {
    var teamToGet = '/team/' + window.location.hash.split('/')[2];
    var context = this;
    Axios.get(teamToGet)
      .then(function(response) {
          console.log(response.data);   
          context.setState({
            game: response.data.game,
            members: response.data.members,
            about: response.data.profile.about,
            times: response.data.profile.times,
            teamName: response.data.profile.teamName,
          });
      });
  },
  handleApply: function() {

  },
  render: function () {
    return (
      <div>
        <div className="row" style={whiteBox}>
          <div className="col-sm-offset-1 col-sm-2">
            <img className="img-circle center-block" width="128" height="128" src={"http://cdn.cutestpaw.com/wp-content/uploads/2012/09/sss.jpg"} />
          </div>
          <div className="col-sm-4">
            <h3>Team: {this.state.teamName}</h3>
            <p>{this.state.about}</p>
          </div>
          <div className="col-sm-2">
            <img className="center-block" width="128" height="128" src="/img/tier-silver.png"/>
          </div>
          <div className="col-sm-2">
            <img className="center-block" width="128" height="128" src="/img/role-support.png"/>
          </div>
        </div>
        <br/>
        <div className="row">
          <div className="col-sm-6">
            <div className="panel panel-default" style={whiteBox}>
              <div className="panel-body">
                <h3 className="text-center">Team Profile </h3>
                <p><b>Available</b>: {this.state.times} </p>
                <p><b>About Us</b>: {this.state.about} </p>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="panel panel-default" style={whiteBox}>
              <div className="panel-body">
                <h3 className="text-center">Current Members</h3>
                <p><b>Admin</b>: Mocking Bird Killa </p>
                <p><b>individual ninjas</b>: {this.state.members} </p>
              </div>
            </div>
          </div>
        </div>
        <br/>
        <div className="row">
          <div className="col-sm-3">
            <div className="panel panel-default" style={whiteBox}>
              <div className="panel-body">
                <img className="center-block" width="64" height="64" src="/img/role-assassin.png"/>
                <p><b>Lane</b>: Mid </p>
                <p><b>Role</b>: Assassin </p>
                <button className="btn btn-default" type="button" onClick={this.handleApply}>Apply</button>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="panel panel-default" style={whiteBox}>
              <div className="panel-body">
                <img className="center-block" width="64" height="64" src="/img/role-tank.png"/>
                <p><b>Lane</b>: Front </p>
                <p><b>Role</b>: Tank </p>
                <button className="btn btn-default" type="button" onClick={this.handleApply}>Apply</button>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="panel panel-default" style={whiteBox}>
              <div className="panel-body">
                <img className="center-block" width="64" height="64" src="/img/role-mage.png"/>
                <p><b>Lane</b>: Jungle </p>
                <p><b>Role</b>: Mage </p>
                <button className="btn btn-default" type="button" onClick={this.handleApply}>Apply</button>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="panel panel-default" style={whiteBox}>
              <div className="panel-body">
                <img className="center-block" width="64" height="64" src="/img/role-marksman.png"/>
                <p><b>Lane</b>: Bot </p>
                <p><b>Role</b>: Marksman </p>
                <button className="btn btn-default" type="button" onClick={this.handleApply}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});  
    
module.exports = TeamProfile;
