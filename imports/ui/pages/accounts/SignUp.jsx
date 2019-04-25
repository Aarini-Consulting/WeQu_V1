import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

import Loading from '/imports/ui/pages/loading/Loading';
import LoadingAnimated from '../loading/LoadingAnimated';

class SignUp extends React.Component {
	constructor(props){
			super(props);
			this.state={
				showLoading:false,
				consentSubs:false,
				consentTerms:false
			}
	}

	normalSignup(data){
		this.setState({
			showLoading: true,
		});

		Meteor.call('createAccount', data, (err, result) => {
			if (err){
				console.log(err);
				this.setState({
					showLoading: false,
				});
				
				$('#error').text(err.message);
			}
			else if(result){
				Meteor.loginWithToken(result.token,(err)=>{
					if(err){
						console.log(err);
						$('#error').text(err.message);
						this.setState({
							showLoading: false,
						});
					}else{
						this.props.history.replace('/');
					}
				}); 
			}else{
				this.setState({
					showLoading: false,
				});
				$('#error').text("unknown error");
			}
		});
	}
	
	handleSubmit(event){
		event.preventDefault();
		if(this.state.consentTerms){
			var firstName = ReactDOM.findDOMNode(this.refs.firstName).value.trim();
			var lastName = ReactDOM.findDOMNode(this.refs.lastName).value.trim();
			var registerEmail = ReactDOM.findDOMNode(this.refs.registerEmail).value.trim();
			var registerPassword = ReactDOM.findDOMNode(this.refs.registerPassword).value.trim();

			var data =  {
				userId: this.props.user && this.props.user._id, 
				firstName: firstName , 
				lastName: lastName, 
				registerEmail:registerEmail, 
				registerPassword:registerPassword, 
				consentSubs:this.state.consentSubs
			}
				
			if(this.props.user){
				this.setState({
					showLoading: true,
				});

				Meteor.call('signUpInvited', data , (err, result) => {
					if(err){
						console.log(err)
						this.setState({
							showLoading: false,
						});
					}else{
						Meteor.loginWithPassword(registerEmail, registerPassword , (err) => {
							if(err){
								console.log(err);
								$('#error').text(err.message);
								this.setState({
									showLoading: false,
								});
							}else{
								this.props.history.replace('/');
							}
						});
					}
				});

			}else{
				this.normalSignup(data);
			}
		}
	}

	toggleConsent (e) {
        this.setState({
            [e.target.name]: e.target.checked,
        });
	}

    render() {
			if(this.state.showLoading){
				return(
					<div className="loginwraper">
							<LoadingAnimated/>
					</div>
				);
			}
			else if(this.props.dataReady){
				if(this.props.user && !this.props.user.profile.trial){
					return(<Redirect to="/"/>);
				}
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
										{this.props.user 
										?
										<input className="emailfield w-input" maxLength="256" ref="registerEmail" placeholder="email address" type="email" style={{textTransform:"lowercase"}}
										defaultValue={this.props.user.emails[0].address} disabled={true} required/>
										:
											this.props.email 
											?
											<input className="emailfield w-input" maxLength="256" ref="registerEmail" placeholder="email address" type="email" style={{textTransform:"lowercase"}}
											defaultValue={this.props.email} disabled={true} required/>
											:
											<input className="emailfield w-input" maxLength="256" ref="registerEmail" placeholder="email address" type="email" style={{textTransform:"lowercase"}}
											required/>
										}
										<input className="emailfield w-input" maxLength="256" ref="registerPassword" placeholder="password" required="required" type="password"/>
										<div className="formtext">
												<input type="checkbox" ref="consentTerms" name="consentTerms" className="signup-consent"
												checked={this.state.consentTerms}
												onChange={this.toggleConsent.bind(this)}
												required/>&nbsp; 
												I have read and agree to the <a href="https://www.weq.io/policy/weq-app-terms-and-conditions" target="_blank" id="terms">Terms</a> and <a href="https://www.weq.io/policy/weq-app-data-process-and-privacy-policy" target="_blank" id="privacyPolicy">Privacy Policy</a>.

										</div>
										<div className="formtext">
												<input type="checkbox" ref="consentSubs" name="consentSubs" className="signup-consent"
												checked={this.state.consentSubs}
												onChange={this.toggleConsent.bind(this)}/>&nbsp; 
												I would like to receive team-boosting related information, offers, recommendations and updates from WeQ
										</div>
										<input className="submit-button w-button" data-wait="Please wait..." type="submit" value="Sign Up"/>
									</form>
									<div id="error" className="errormsg"></div>
									<Link to="/login" className="signup" id="signIn">Log In</Link>
								</div>  
							</div>
						</div>
				</div>
				);
			}
			else{
				return(<Loading/>);	
			}
    }
}

export default withTracker((props) => {
	var user;
	var dataReady;
	var handle = Meteor.subscribe('users', {_id : props.match.params.id}, {}, {
        onError: function (error) {
                console.log(error);
            }
		});
		
	if(handle.ready()){
		if(props.match && props.match.params && props.match.params.id){
			user = Meteor.users.findOne({_id : props.match.params.id});
		}
		dataReady = true;
	}
	
	return {
		dataReady:dataReady,
		user: user,
	};
  })(SignUp);
  
