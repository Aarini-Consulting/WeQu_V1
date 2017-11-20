import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

export default class SignUp extends React.Component {
			handleSubmit(event){
				event.preventDefault();
				var firstName = ReactDOM.findDOMNode(this.refs.firstName).value.trim();
				var lastName = ReactDOM.findDOMNode(this.refs.lastName).value.trim();
				var registerEmail = ReactDOM.findDOMNode(this.refs.registerEmail).value.trim();
				var registerPassword = ReactDOM.findDOMNode(this.refs.registerPassword).value.trim();

				let data = {registerEmail:registerEmail, registerPassword:registerPassword, firstName: firstName, lastName:lastName}
				Meteor.call('createAccount', data, (err, result) => {
					if (err){
						console.log(err);
						$('#error').text(err.message);
					}
					else if(result){
						Meteor.loginWithToken(result.token,(err)=>{
							if(err){
								console.log(err);
								$('#error').text(err.message);
							}else{
								this.props.history.replace('/');
							}
						}); 
					}else{
						$('#error').text("unknown error");
					}
				});
		}
    render() {
        return (
            <div className="loginwraper">
			    <div className="loginbox signupbox">
			    	<img className="image-3" src="/img/assets/WEQU_LOGO_NEW.png"/>
				    <div className="formareaSignUp w-container">
				      	{/* <a id="linkedinSignupbttn" className="linkedinbttn w-button" href="#">Sign Up With LinkedIn</a> */}
				        <div className="w-form">
				          <form className="loginemail" data-name="Email Form" name="email-form" onSubmit={this.handleSubmit.bind(this)}>
				            <input className="emailfield w-input" maxLength="256" ref="firstName" placeholder="first name" required="required" type="text"/>
				            <input className="emailfield w-input" maxLength="256" ref="lastName" placeholder="last name" required="required" type="text"/>
				            <input className="emailfield w-input" maxLength="256" ref="registerEmail" placeholder="email address" type="text" style={{textTransform:"lowercase"}}
				             required/>
				            <input className="emailfield w-input" maxLength="256" ref="registerPassword" placeholder="password" required="required" type="password"/>
				            <div className="formtext">	By clicking Sign Up, you agree to our <Link to="/terms" id="terms">Terms</Link> and confirm that you have read our <Link to="/privacy" id="privacyPolicy">Privacy Policy</Link>.</div>
				            <input className="submit-button w-button" data-wait="Please wait..." type="submit" value="Sign Up With Email"/>
				          </form>
				          <div id="error" className="errormsg"></div>
									<Link to="/login" className="signup" id="signIn">Log In</Link>
				        </div>  
				      </div>
				    </div>
			</div>
        );
    }
}
