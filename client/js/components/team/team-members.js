var React = require('react');
var Router = require('react-router');
var Axios = require('axios');
var _ = require('lodash');

var RecUtil = require('../../utils/recUtil.js');

var TeamMembers = React.createClass({
  render : function() {

    var membersList = [];

    for (var i = 0; i < this.props.members.length; i++) {
      var context = this;
      var currentMembers = context.props.members;
      var addLanes = RecUtil.arrayToString(currentMembers[i].lanes);
      var addRoles = RecUtil.arrayToString(currentMembers[i].roles);

      membersList.push(
        <div className="col-sm-12" style={{marginBottom: "15px"}} key={i}>
          <div className="col-sm-3">
            <img className="img-circle img-fit" src={currentMembers[i].avatar} />
          </div>
          <div className="col-sm-3">
            <p><b>Name</b>: {currentMembers[i].name}</p>
          </div>
          <div className="col-sm-6">
            <p><b>Lane</b>: {addLanes}</p>
            <p><b>Role</b>: {addRoles}</p>
          </div>
        </div>
      )
    };

    return (
      <div className="membersList">
        {membersList}
      </div>
    )
  }
});

module.exports = TeamMembers;
