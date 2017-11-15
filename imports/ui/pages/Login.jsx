import React from 'react';
import { Link } from 'react-router';

export default class Login extends React.Component {
  render() {
    return (
        <div className="loginBody">

            <div className="row {{#unless linkedinInvitedUser}}linkedinInvitedUser{{/unless}}"> 	

                <div className="loginwraper">
                    <div className="loginbox" data-ix="loginbox"><img className="image-3" src="/img/assets/WEQU_LOGO_NEW.png"/>
                    <div className="formarea w-container">
                
                        <a id="logInLinkedIn" className="linkedinbttn w-button" href="#" >Log In With LinkedIn</a>
                    
                        <div style="visibility:{{#if groupLinkedinInvitedUser}}visible{{else}}hidden{{/if}}" className="w-form">

                        <form className="loginemail" data-name="Email Form" id="signIn" name="email-form">
                            <input className="emailfield w-input" maxlength="256" name="loginEmail" placeholder="email address" type="email" value="{{invitedEmail}}" disabled={{emailDisable}} required style="text-transform:lowercase"/>
                            <input className="emailfield w-input" maxlength="256" name="loginPassword" placeholder="password" required="required" type="password"/>
                            <a className="linktext" href="/RecoverPassword">Forgotten password?</a>
                            <input className="submit-button w-button" data-wait="Please wait..." type="submit" value="Log In With Email"/>
                        </form>
                        <div id="error" className="errormsg"></div>
                        </div>

                        <a id="sign-up" className="loginBtn" href="#">Sign Up</a>
                    </div>
                    </div>
                </div>
            </div>

        </div>
    );
  }
}
