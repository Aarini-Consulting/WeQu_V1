import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Loading from '/imports/ui/pages/loading/Loading';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

class ResetPassword extends React.Component {

    handleSubmit(event) {
        event.preventDefault();
        $('#error').text("");

        // Find the text field via the React ref
        const newPassword = ReactDOM.findDOMNode(this.refs.newPassword).value.trim();
        const confirm = ReactDOM.findDOMNode(this.refs.confirmPassword).value.trim();

        var errormsg;
    
        if(newPassword === confirm){
          Accounts.resetPassword(this.props.match.params.token, newPassword, (err) => {
          if (err){
            $('#error').text(err.message);
          }
          else {
            this.props.history.replace('/login');
          }
        });
        }
        else{
            $('#error').text(i18n.getTranslation("weq.ResetPassword.passwordMismatch"));
        }
        
        // Clear form
        //ReactDOM.findDOMNode(this.refs.newPassword).value = '';
      }

    render() {
        if(this.props.dataReady){
            if(this.props.user){
                return (
                    <section className="whiteText alignCenter feed">
                        <div className="loginwraper">
                            <div className="forgottenpw loginbox"><img className="image-3" src="/img/assets/WEQU_LOGO_NEW.png"/>
                            <div className="formarea w-container">
                                <h1 className="formheader"><T>weq.ResetPassword.CreateNewPassword</T></h1>
                                {/* <p className="formtext lostpw">Enter your new password below</p> */}
                                <div className="w-form">
                                <form className="loginemail" data-name="Email Form" id="forgot-password" name="email-form"  onSubmit={this.handleSubmit.bind(this)}>
                                    <input className="emailfield w-input" maxLength="256" ref="newPassword" placeholder={i18n.getTranslation("weq.ResetPassword.newPassword")} required type="password"/>
                                    <input className="emailfield w-input" maxLength="256" ref="confirmPassword" placeholder={i18n.getTranslation("weq.ResetPassword.confirmPassword")} required type="password"/>
                                    <div style={{height: 6 + "px"}}></div>
                                    <input className="submit-button w-button" data-wait={i18n.getTranslation("weq.ResetPassword.PleaseWait")} type="submit" value="Set New Password"/>
                                </form>
                                    <div id="info" className="info"></div>
                                    <div id="error" className="errormsg"></div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </section>
                );
            }else{
                return (
                    <section className="whiteText alignCenter feed">
                        <div className="loginwraper">
                                <div className="forgottenpw">
                                <img className="image-3" src="/img/assets/WEQU_LOGO_NEW.png"/>
                                <div className="formarea w-container">
                                    <h1 className="formheader"><T>weq.ResetPassword.ResetPasswordLinkExpired</T></h1>
                                    <br/>
                                    <p className="info"><T>weq.ResetPassword.Troubleshootings</T> </p>
                                    <p className="info"><T>weq.ResetPassword.DidYouMakeMultipleRequestForPasswordReset</T>
                                        <br/>
                                        <T>weq.ResetPassword.ExistingResetPasswordLinkExpires</T>
                                        <br/> 
                                        <T>weq.ResetPassword.BeSureUseLinkTheLast</T>
                                    </p>
                                    <p className="info"><T>weq.ResetPassword.WhenDidYouRequestThisPasswordReset</T>
                                        <br/>
                                        <T>weq.ResetPassword.ForSecurityReasonsResetPasswordLink</T>
                                        <br/>
                                    </p>
                                </div>
                                </div>
                            </div>
                    </section>
                );
            }
            
        }else{
            return (
                <section className="whiteText alignCenter feed">
                    <div className="loginwraper">
                        <Loading/>
                    </div>
                </section>
            );
        }
        
    }
}

export default withTracker((props) => {
	var user;
	var dataReady;
	var handle = Meteor.subscribe('users',{"services.password.reset.token": props.match.params.token}, {}, {
        onError: function (error) {
                console.log(error);
            }
		});
		
	if(handle.ready()){
		if(props.match.params.token){
			user = Meteor.users.findOne({"services.password.reset.token": props.match.params.token});
		}
        dataReady = true;
	}
	
	return {
		dataReady:dataReady,
		user: user,
	};
  })(ResetPassword);