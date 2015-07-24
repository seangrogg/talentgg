var React = require('react/addons');
var Router = require('react-router');
var Axios = require('axios');

var ReactBtn = require('react-btn-checkbox');
var Checkbox = ReactBtn.Checkbox;

var belle = require('belle');
Button = belle.Button;
TextInput = belle.TextInput;

var TeamRegistration = React.createClass({
  mixins: [Router.State, Router.Navigation, React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      teamName: "",
      about: "",
      profile: {
        times: {
          "weekdays": false,
          "weeknights": false,
          "weekends": false
        },
        purpose: {
          "3x3 Casual": false,
          "5x5 Casual": false,
          "5x5 Ranked": false
        },        
        lanes: {
          top: false,
          mid: false,
          bot: false,
          jungle: false
        },
        roles: {
          assassin: false,
          mage: false,
          marksman: false,
          bruiser: false,
          support: false,
          tank: false
        }
     }
  };

  },
  handleSubmit: function(e) {
    e.preventDefault();
    var teamBio = this.state;
    
    
    $.post("/team/register", teamBio);
    this.transitionTo('profile', {username: 'username'});
  },  
  render: function() {
    var teamName = this.state.teamName,
     about = this.state.about;
    return (
      <div className="container">
        <form id="teamform" onSubmit={this.handleSubmit}>
          <h1> Team Settings </h1>

          <label> Team Name: </label><TextInput defaultValue=""
           allowNewLine={ false } maxLength="16" name="teamName"  valueLink={this.linkState('teamName')} />

          <label>About Us: </label> <TextInput defaultValue="We haven't filled this out yet." 
           allowNewLine={ true } name="about"  valueLink={this.linkState('about')} />

          <Checkbox
          label='Times Available: '
          options={this.state.profile.times}
          onChange={this.setState.bind(this)}
          bootstrap />

          <Checkbox
          label='Purpose: '
          options={this.state.profile.purpose}
          onChange={this.setState.bind(this)}
          bootstrap />

          <h2> Needs </h2>
          <Checkbox
          label='lanes: '
          options={this.state.profile.lanes}
          onChange={this.setState.bind(this)}
          bootstrap />

          <Checkbox
          label='roles: '
          options={this.state.profile.roles}
          onChange={this.setState.bind(this)}
          bootstrap />

          <Button primary type="submit" value="Submit">Submit</Button>
        
        </form>
      </div>
    )
  }
});

module.exports = TeamRegistration;
