var React = require('react');
var Router = require('react-router');

var Settings = React.createClass({

  getInitialState: function(){
    return {
      verifyKey: "",
      verified: "",
      displayName: ""
    }
  },

  componentDidMount: function(){
    $.get('/profile', function(result){
      if(this.isMounted()){
        this.setState({
          verifyKey: result.games.verifyKey,
          verified: result.games.verified,
          displayName: result.displayName
        })
      }
    }.bind(this));
  },

  labels: 'col-sm-3 col-md-offset-1 col-md-2 control-label',
  fields: 'col-sm-9 col-md-8',

  // handleChange: function(e){
  //   this.setState({
  //     displayName: e.target.value
  //   });
  // },

  render: function(){
    return(
      <form className="form-horizontal" method="POST" action="/settings">
        <h3>Change Email and Password</h3>
        <br/>
        <div className="form-group">
          <label className={this.labels}>New Email</label>
          <div className={this.fields}>
            <input type="text" className="form-control" name="email" />
          </div>
        </div>
        <div className="form-group">
          <label className={this.labels}>New Password</label>
          <div className={this.fields}>
            <input type="password" className="form-control" name="pass1" />
          </div>
        </div>
        <div className="form-group">
          <label className={this.labels}>Confirm Password</label>
          <div className={this.fields}>
            <input type="password" className="form-control" name="pass2" />
          </div>
        </div>
        <br/>
        <div className="form-group">
          <label className={this.labels}>Current Password</label>
          <div className={this.fields}>
            <input type="password" className="form-control" name="confirm" placeholder="You must enter your current password for any changes to take effect" />
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-5 col-sm-2">
            <button type="submit" className="btn btn-default btn-block">Update</button>
          </div>
        </div>
      </form>
    )
  }
});

module.exports = Settings;
