var React = require('react');
var History = require('react-router').History;
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var ApiUtil = require('../util/apiUtil');
var LoginErrorStore = require('../stores/loginErrorStore');
const { connect } = require('react-redux');
const { loginUser, signUpUser } = require('../actions/index');

const LoginWindow = React.createClass({
  mixins: [LinkedStateMixin, History],
  getInitialState: function(){
    return ({
      loggedIn: false,
      errors: this.props.errors,
      showSignUp: this.props.showSignUp,
      username: "",
      properlyFilledout: false
    });
  },
  createUser: function () {
    // alert("user created "+this.state.newUsername);
  },
  _submit: function (e) {
    e.preventDefault();
    if(this.state.showSignUp){
      this.props.signUpUser({username: this.state.username, password: this.state.password});
      // this.setState({username: "", password: ""});
    }else{
      this.props.loginUser({username: this.state.username, password: this.state.password});
    }
  },
  _guestLogin: function () {
    this.props.loginUser({username: 'Guest', password: 'password'});
  },
  _toggleSignUp: function () {
    this.setState({showSignUp: !this.state.showSignUp});
  },
  _checkPasswordMatch: function () {
    console.log("passwords");
    this._validate();
    if(this.state.password !== this.state.passwordConfirm){
      this.setState({errors: "Passwords don't match"});
      this.state.properlyFilledout = false;
    }else{
      this.setState({errors: ""});
    }
    console.log("fillout", this.state.properlyFilledout);
  },
  _validate: function() {
    console.log(this.state.properlyFilledout);
    if(this.state.username && this.state.password){
      this.state.properlyFilledout = true;
    }else{
      this.state.properlyFilledout = false;
    }
    console.log("fillout", this.state.properlyFilledout);
  },
  close: function (e) {
    if(e.target.className === "fixedLogin"){
      if(this.props.toggleShowLogin){
        this.props.toggleShowLogin();
      }else{
        this.props.updatePoemState({showLogin: false});
      }
    }
  },
  render: function () {
    var toggleText;
    if(this.state.showSignUp){
      toggleText = (
        <div>Already have an account? <span className="link" onClick={this._toggleSignUp}>
             Log In
          </span>
        </div>);
    }else{
      toggleText = (
        <div>New user? <span className="link" onClick={this._toggleSignUp}>
             Sign Up Here
          </span>
        </div>);
    }
    var confirmPassword = (
      <label>Confirm Password<br/>
        <input type="password" valueLink={this.linkState('passwordConfirm')} onBlur={this._checkPasswordMatch}></input>
      </label>
    );
    return(
      <div className="fixedLogin" onClick={this.close}>
        <div className="loginWindow">
          <h2>{this.state.showSignUp ? "Sign Up" : "Log In"}</h2>
          <div className="loginErrors">{this.props.errors} {this.state.errors}</div>
          <form onSubmit={this._submit}>
            <label>Username<br/>
              <input type="text" valueLink={this.linkState('username')} onBlur={this._validate}></input>
            </label>
            <br/>
            <label>Password<br/>
              <input type="password" valueLink={this.linkState('password')} onBlur={this._validate}></input>
            </label><br/>
          {this.state.showSignUp ? confirmPassword : " "}<br/>
          <input type="submit" value="Submit"></input>
          </form>
          <br/>
          {toggleText}
          Just want a demo? <br/>
        <button id="guestLoginBtn" onClick={this._guestLogin}>Guest Log In</button>
        </div>
      </div>
    );
  }
});

const mapDispatchToProps = {
  loginUser,
  signUpUser,
};

function mapStateToProps(state) {
  return {
    errors: state.loginMessages[0],
  };
};



module.exports = connect(mapStateToProps, mapDispatchToProps)(LoginWindow);