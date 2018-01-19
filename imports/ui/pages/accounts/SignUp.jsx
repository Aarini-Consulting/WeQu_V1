import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

import Loading from '/imports/ui/pages/loading/Loading';

class SignUp extends React.Component {
	constructor(props){
			super(props);
			this.state={
				showLoading:false,
			}
	}

	normalSignup(data){
		this.setState({
			showLoading: true,
		});
		var emailVerification = true;
		//signing up from group invitation link
		//set newly created account's email as verified
		if(this.props.email){
			emailVerification = false;
		}

		Meteor.call('createAccount', data, emailVerification, (err, result) => {
			this.setState({
				showLoading: false,
			});

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
	
	handleSubmit(event){
		event.preventDefault();
		var firstName = ReactDOM.findDOMNode(this.refs.firstName).value.trim();
		var lastName = ReactDOM.findDOMNode(this.refs.lastName).value.trim();
		var registerEmail = ReactDOM.findDOMNode(this.refs.registerEmail).value.trim();
		var registerPassword = ReactDOM.findDOMNode(this.refs.registerPassword).value.trim();

		var data =  {userId: this.props.user && this.props.user._id, firstName: firstName , lastName: lastName, 
			registerEmail:registerEmail, registerPassword:registerPassword }
			
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
    render() {
			if(this.state.showLoading){
				return(
					<div className="loginwraper">
							<Loading/>
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
															<input className="emailfield w-input" maxLength="256" ref="registerEmail" placeholder="email address" type="text" style={{textTransform:"lowercase"}}
															defaultValue={this.props.user.emails[0].address} disabled={true} required/>
															:
																this.props.email 
																?
																<input className="emailfield w-input" maxLength="256" ref="registerEmail" placeholder="email address" type="text" style={{textTransform:"lowercase"}}
																defaultValue={this.props.email} disabled={true} required/>
																:
																<input className="emailfield w-input" maxLength="256" ref="registerEmail" placeholder="email address" type="text" style={{textTransform:"lowercase"}}
																required/>
															}
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
			else{
				return(<Loading/>);
				
			}
    }
}

export default withTracker((props) => {
	var user;
	var dataReady;
	var handle = Meteor.subscribe('users', {
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
  
