import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

export default class RecoverPassword extends React.Component {
    handleSubmit(event) {
        event.preventDefault();
        // Find the text field via the React ref
        const useremail = ReactDOM.findDOMNode(this.refs.useremail).value.trim();
    
        //Meteor.call('tasks.insert', text);
        var errormsg = ReactDOM.findDOMNode(this.refs.errormsg);
        Accounts.forgotPassword({email: useremail}, (err)=> {
          if (err){
            console.log(err);
            $('#error').text(err.message);
          }
          else {
            $('#info').text('Email Sent. Check your mailbox.');
          }
        });
    
        // Clear form
        //ReactDOM.findDOMNode(this.refs.useremail).value = '';
      }

    render() {
        return (
            <section className="whiteText alignCenter feed">
                <div className="loginwraper">
                    <div className="forgottenpw loginbox"><img className="image-3" src="/img/assets/WEQU_LOGO_NEW.png"/>
                    <div className="formarea w-container">
                        <h1 className="formheader">Reset your password</h1>
                        <p className="formtext lostpw">Enter your email address. You will receive a link to create a new password via email</p>
                        <div className="w-form">
                        <form className="loginemail" data-name="Email Form" id="forgot-password" name="email-form"  onSubmit={this.handleSubmit.bind(this)}>
                            <input className="emailfield w-input" maxLength="256" ref="useremail" placeholder="email address" type="email" required/>
                            <div style={{height: 6 + "px"}}></div>
                            <input className="submit-button w-button" data-wait="Please wait..." type="submit" value="Get New Password"/>
                        </form>
                            <div id="info" className="info"></div>
                            <div id="error" className="errormsg"></div>
                            <Link to="/login" className="loginBtn" id="signIn">Log In</Link>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
        );
    }
}
