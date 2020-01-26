import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class RecoverPassword extends React.Component {
    constructor(props){
        super(props);
        this.state={
          sendingResetEmail:false,
          error:false,
          resetEmailSent:false,
          userEmail:""
        }
    }
    
    handleSubmit(event) {
        event.preventDefault();
        const useremail = this.state.userEmail;
        if(!this.state.sendingResetEmail){
            this.setState({
                sendingResetEmail:true,
                error:false,
                resetEmailSent:undefined
            },()=>{
                Accounts.forgotPassword({email: useremail}, (err)=> {
                    if (err){
                      console.log(err);
                      this.setState({
                          error:err.message,
                          sendingResetEmail:false
                      });
                    }
                    else {
                      this.setState({
                          resetEmailSent: true,
                          sendingResetEmail:false
                      });
                    }
                });
            });
        }
    
        // Clear form
        //ReactDOM.findDOMNode(this.refs.useremail).value = '';
    }

    handleEmailChange(event) {
        this.setState({userEmail: event.target.value});
    }

    tryAgainClick(event){
        event.preventDefault();
        this.setState({
            sendingResetEmail:false,
            error:false,
            resetEmailSent:undefined
        });
    }


    render() {
        return (
            <section className="whiteText alignCenter feed">
                <div className="loginwraper">
                    <div className="forgottenpw loginbox"><img className="image-3" src="/img/assets/WEQU_LOGO_NEW.png"/>
                    <div className="formarea w-container">
                        {(!this.state.resetEmailSent && !this.state.error) && 
                            <div className="w-form">
                            <h1 className="formheader"><T>weq.RecoverPassword.resetYourPassword</T></h1>
                            <p className="formtext lostpw"><T>weq.RecoverPassword.enterYourEmailAddress</T></p>
                            <form className="loginemail" data-name="Email Form" id="forgot-password" name="email-form"  onSubmit={this.handleSubmit.bind(this)}>
                            <input className="emailfield w-input" maxLength="256" placeholder="email address" type="email" required
                            value={this.state.userEmail} onChange={this.handleEmailChange.bind(this)}/>
                            <div style={{height: 6 + "px"}}></div>
                            {this.state.sendingResetEmail 
                            ? <input className="submit-button w-button" type="submit" value={i18n.getTranslation("weq.RecoverPassword.pleaseWait")} disabled={true}/>
                            : <input className="submit-button w-button" type="submit" value="Get New Password"/>
                            }
                            </form>
                            </div>
                        }
                        
                        {this.state.resetEmailSent &&
                            <div className="w-form">
                                <h1 className="formheader"><T>weq.RecoverPassword.EmailSent</T></h1>
                                <p className="info"><T>weq.RecoverPassword.CheckYour</T> <b>{this.state.userEmail}</b> <T>weq.RecoverPassword.inboxForInstructionsFrom</T></p>
                                <br/>
                                <br/>
                                <div className="formtext lostpw"> <T>weq.RecoverPassword.UnsureIfThatEmailaddress</T></div>
                                <div className="formtext lostpw"><a onClick={this.tryAgainClick.bind(this)}><T>weq.RecoverPassword.ClickHere</T></a> <T>weq.RecoverPassword.ToTryAgain</T></div>
                            </div>
                        }
                        {this.state.error &&
                            <div className="w-form">
                                <h1 className="formheader"><T>weq.RecoverPassword.Oops</T></h1>
                                <p className="info"><T>weq.RecoverPassword.ThatDoesntSeemtoWork</T></p>
                                <div id="error" className="errormsg">{this.state.error}</div>
                                <br/>
                                <br/>
                                <input className="submit-button w-button" type="submit" value={i18n.getTranslation("weq.RecoverPassword.TryAgain")} onClick={this.tryAgainClick.bind(this)}/>
                            </div>
                        } 
                            <Link to="/login" className="loginBtn" id="signIn"><T>weq.RecoverPassword.LogIn</T></Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
