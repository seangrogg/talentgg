/* THESE ACTIONS ARE TRIGGERED FROM OUR VIEW COMPONENTS.

 EXAMPLE: WHEN THE USER SUBMITS THEIR LOGIN
 A NEW ACTION IS CREATED WITH A PAYLOAD.
 PAYLOADS ARE DATA THAT ARE GIVEN TO REGISTERED STORES.
 IN THIS CASE OUR PAYLOAD WOULD BE THE E-MAIL
 & PASSWORD.


 */



var AppConstants = require("../constants/app-constants");



var ActionTypes = AppConstants.ActionTypes;

module.exports = {

  // Action is created with
  signup: function (email, password, passwordConfirmation) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.SIGNUP_REQUEST,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation
    });
    WebAPIUtils.signup(email, password, passwordConfirmation);
  },

  login: function(email, password){
    AppDispatcher.handleViewAction({
      type: ActionTypes.LOGIN_REQUEST,
      email: email,
      password: password
    });
    WebAPIUtils.login(email, password);
  },

  logout: function() {
    AppDispatcher.handleViewAction({
      type: ActionTypes.LOGOUT
    });
  }
};



