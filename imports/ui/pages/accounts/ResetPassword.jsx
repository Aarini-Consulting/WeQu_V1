import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

export default class ResetPassword extends React.Component {

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
        return (
            <section className="whiteText alignCenter feed">
                <div className="loginwraper">
                    <div className="forgottenpw loginbox"><img className="image-3" src="/img/assets/WEQU_LOGO_NEW.png"/>
                    <div className="formarea w-container">
                        <h1 className="formheader">Recover your password</h1>
                        <p className="formtext lostpw">Enter your new password below</p>
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
    }
}
