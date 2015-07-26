var React = require('react');
var Router = require('react-router');

var AccountLink = React.createClass({

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

  // handleChange: function(e){
  //   this.setState({
  //     displayName: e.target.value
  //   });
  // },

  regionList: ['NA', 'EUNE', 'EUW', 'KR', 'BR', 'LAN', 'LAS', 'OCE', 'RU', 'TR'],

  render: function(){
    return(
      <div>
        <div className={this.state.verified ? "" : "invisible"}>
        <h2>Congratulations, {this.state.displayName}, your account is connected!</h2>
        </div>
        <h3>Look up your profile</h3>
        <br/>
        <form className="form-horizontal" method="POST" action="/setSummoner">
          <div className="form-group">
            <label className="col-sm-2 control-label">Summoner</label>
            <div className="col-sm-4">
              <input type="text" className="form-control" name="name" />
            </div>
            <label className="col-sm-2 control-label">Region</label>
            <div className="col-sm-2">
              <select className="form-control" name="region">
                {this.regionList.map(function(val, i){ return <option key={i} value={val}>{val}</option> })}
              </select>
            </div>
            <div className="col-sm-2">
              <button type="submit" className="btn btn-default btn-block">Lookup</button>
            </div>
          </div>
          <p className={this.state.verified ? "text-danger" : "invisible"}>Performing a lookup will unset your current summoner profile!</p>
        </form>
        <div className={this.state.verifyKey ? "" : "invisible"}>
          <form className="form-horizontal" method="POST" action="/verifySummoner">
            <h3>Verify Account</h3>
            <br/>
            <div className="form-group">
              <div className="col-sm-10">
                <span className="text-center">In order to verify your account you must change the name of your <b>first rune page</b> to: <b>{this.state.verifyKey}</b></span>
              </div>
              <div className="col-sm-2">
                <button type="submit" className="btn btn-default btn-block">Verify</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
});

module.exports = AccountLink;
