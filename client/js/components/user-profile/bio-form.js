var React = require('react/addons');
var Router = require('react-router');
var Axios = require('axios');
var Profile = require('./profile');

var ReactBtn = require('react-btn-checkbox');
var Checkbox = ReactBtn.Checkbox;

var belle = require('belle');
Button = belle.Button;
TextInput = belle.TextInput;


var BioForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin, Router.State, Router.Navigation],
  getInitialState: function() {
    return {
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
      about: "",
      favorite: "",
      lanes: {
        "top": false,
        "mid": false,
        "bot": false,
        "jungle": false
      },
      roles: {
        "assassin": false,
        "mage": false,
        "marksman": false,
        "bruiser": false,
        "support": false,
        "tank": false
      }
    };
  },
  componentDidMount: function() {
    var context = this;
    Axios.get('/profile').
      then(function(response) {
        context.setState({
          times: response.data.bio.times,
          purpose: response.data.bio.purpose,
          about: response.data.bio.about,
          favorite: response.data.bio.favorite,
          lanes: response.data.bio.lanes,
          roles: response.data.bio.roles,
        });
      });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var bio = this.state;
    $.post("/profile", bio);
    location.reload();
  },
  render: function() {

    return (
      <div className="container">
        <form className="form-horizontal" id="bioform" onSubmit={this.handleSubmit}>

          <div className="form-group">
            <label className="control-label col-sm-3 col-md-2">Times Available</label>
            <div className="col-sm-9 col-md-10">
              <Checkbox
              label = ""
              options={this.state.times}
              onChange={this.setState.bind(this)}
              bootstrap />
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-3 col-md-2">Playstyle</label>
            <div className="col-sm-9 col-md-10">
              <Checkbox
              label = ""
              options={this.state.purpose}
              onChange={this.setState.bind(this)}
              bootstrap />
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-3 col-md-2">Lanes</label>
            <div className="col-sm-9 col-md-10">
              <Checkbox
              label = ""
              options={this.state.lanes}
              onChange={this.setState.bind(this)}
              bootstrap />
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-3 col-md-2">Roles</label>
            <div className="col-sm-9 col-md-10">
              <Checkbox
              label = ""
              options={this.state.roles}
              onChange={this.setState.bind(this)}
              bootstrap />
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-3 col-md-2">About Me</label>
            <div className="col-sm-offset-3 col-md-offset-2">
              <TextInput defaultValue="This TextInput has allowNewLine set to true. Just press 'Return' once editing the text."
               allowNewLine={ true } name="about" valueLink={this.linkState('about')} />
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-5 col-sm-2">
              <Button primary type="submit" value="Submit">Submit</Button>
            </div>
          </div>

        </form>
      </div>
    )
  }
});

module.exports = BioForm;
