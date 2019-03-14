import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Loading from '/imports/ui/pages/loading/Loading';

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
            $('#error').text("password mismatch");
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
                                <h1 className="formheader">Create a new password</h1>
                                {/* <p className="formtext lostpw">Enter your new password below</p> */}
                                <div className="w-form">
                                <form className="loginemail" data-name="Email Form" id="forgot-password" name="email-form"  onSubmit={this.handleSubmit.bind(this)}>
                                    <input className="emailfield w-input" maxLength="256" ref="newPassword" placeholder="new password" required type="password"/>
                                    <input className="emailfield w-input" maxLength="256" ref="confirmPassword" placeholder="confirm password" required type="password"/>
                                    <div style={{height: 6 + "px"}}></div>
                                    <input className="submit-button w-button" data-wait="Please wait..." type="submit" value="Set New Password"/>
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
                                    <h1 className="formheader">Reset password link expired</h1>
                                    <br/>
                                    <p className="info">Troubleshootings: </p>
                                    <p className="info">1. Did you make multiple request for password reset?
                                        <br/>
                                        Existing Reset password link expires as soon as you request a new reset password request.
                                        <br/> 
                                        Be sure to use the link on the last Reset password email that we sent to you.
                                    </p>
                                    <p className="info">2. When did you request this password reset?
                                        <br/>
                                        For security reasons, Reset password link becomes invalid after 72 hours.
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