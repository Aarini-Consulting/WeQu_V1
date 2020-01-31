import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

import Loading from '/imports/ui/pages/loading/Loading';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

class Login extends React.Component {
    handleSubmit(event){
        event.preventDefault();
        var loginEmail = ReactDOM.findDOMNode(this.refs.loginEmail).value.trim();
        var loginPassword = ReactDOM.findDOMNode(this.refs.loginPassword).value.trim();
        var postLoginRedirect = Session.get("loginRedirect");
        Meteor.loginWithPassword(loginEmail, loginPassword, (err) => {
          if (err){
            console.log(err);
            $('#error').text(err.message);
          }
          else {
            if(postLoginRedirect){
                //unset session variable
                Session.set("loginRedirect",undefined);
                Session.set("loggedOut",undefined);
    
                this.props.history.replace(postLoginRedirect);
            }else{
                this.props.history.replace('/');
            } 
          }
        });
      }

    render() {
        if(this.props.dataReady){
            return (
                <div className="loginBody">
                    <div className={"row " + (this.props.linkedinInvitedUser ? '' : 'linkedinInvitedUser')}> 	
                        <div className="loginwraper">
                            <div className="loginbox" data-ix="loginbox"><img className="image-3" src="/img/assets/WEQU_LOGO_NEW.png"/>
                            <div className="formarea w-container">
                        
                                {/* <a id="logInLinkedIn" className="linkedinbttn w-button" href="#" >Log In With LinkedIn</a> */}
                            
                                <div style={{visibility:this.props.groupLinkedinInvitedUser ? 'hidden' : 'visible'}} className="w-form">
    
                                <form className="loginemail" data-name="Email Form" id="signIn" name="email-form" onSubmit={this.handleSubmit.bind(this)}>
                                    
                                    {this.props.user 
                                    ?
                                    <input className="emailfield w-input" maxLength="256" ref="loginEmail" placeholder={i18n.getTranslation("weq.Login.emailPlaceHolder")} type="email" 
                                    defaultValue={this.props.user.emails[0].address} disabled={true}  
                                    required style={{textTransform:"lowercase"}}/>
                                    :
                                    <input className="emailfield w-input" maxLength="256" ref="loginEmail" placeholder={i18n.getTranslation("weq.Login.emailPlaceHolder")} type="email" 
                                    required style={{textTransform:"lowercase"}}/>
                                    }
                                    
                                    <input className="emailfield w-input" maxLength="256" ref="loginPassword" placeholder={i18n.getTranslation("weq.Login.password")} required type="password"/>
                                    <Link to="/recover-password" className="linktext">{<T>weq.Login.forgottenPassword</T>}</Link>
                                    <input className="submit-button w-button" data-wait="Please wait..." type="submit" defaultValue={i18n.getTranslation("weq.SignUp.LogIn")}/>
                                </form>
                                <div id="error" className="errormsg"></div>
                                </div>
                                <Link to="/sign-up" id="sign-up" className="loginBtn">{<T>weq.Login.signUP</T>}</Link>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }else{
            return(<Loading/>);
        }
        
    }
}

export default withTracker((props) => {
	var user;
	var dataReady;
	var handle = Meteor.subscribe('users',{_id : props.match.params.id}, {}, {
        onError: function (error) {
                console.log(error);
            }
		});
		
	if(handle.ready()){
		if(props.match.params.id){
			user = Meteor.users.findOne({_id : props.match.params.id});
		}
		dataReady = true;
	}
	
	return {
		dataReady:dataReady,
		user: user,
	};
  })(Login);