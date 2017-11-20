import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

export default class Login extends React.Component {
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
    
                this.props.history.replace(postLoginRedirect);
            }else{
                this.props.history.replace('/');
            } 
          }
        });
      }

    render() {
        return (
            <div className="loginBody">
                <div className={"row " + (this.props.linkedinInvitedUser ? '' : 'linkedinInvitedUser')}> 	
                    <div className="loginwraper">
                        <div className="loginbox" data-ix="loginbox"><img className="image-3" src="/img/assets/WEQU_LOGO_NEW.png"/>
                        <div className="formarea w-container">
                    
                            {/* <a id="logInLinkedIn" className="linkedinbttn w-button" href="#" >Log In With LinkedIn</a> */}
                        
                            <div style={{visibility:this.props.groupLinkedinInvitedUser ? 'hidden' : 'visible'}} className="w-form">

                            <form className="loginemail" data-name="Email Form" id="signIn" name="email-form" onSubmit={this.handleSubmit.bind(this)}>
                                <input className="emailfield w-input" maxLength="256" ref="loginEmail" placeholder="email address" type="email" defaultValue={this.props.invitedEmail}  required style={{textTransform:"lowercase"}}/>
                                <input className="emailfield w-input" maxLength="256" ref="loginPassword" placeholder="password" required type="password"/>
                                <Link to="/recover-password" className="linktext">Forgotten password?</Link>
                                <input className="submit-button w-button" data-wait="Please wait..." type="submit" defaultValue="Log In With Email"/>
                            </form>
                            <div id="error" className="errormsg"></div>
                            </div>
                            <Link to="/sign-up" id="sign-up" className="loginBtn">Sign Up</Link>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// export default withTracker((props) => {
    // var dataReady;
    // var handle = Meteor.subscribe('connections', props.secret, {
    //     onError: function (error) {
    //             console.log(error);
    //         }
    //     });
    // dataReady = handle.ready();
    
    // var invitedGroupLinkedin = false;
    // var invitedLinkedin = false;
    // var setQuizPerson = undefined;
    // var setGroupQuizPerson = undefined;
    // var user = undefined;

    // if(props.match.params.invited == "groupInvitationLinkedinUser"  ){
    //     invitedGroupLinkedin = true;
    // }

    // if(props.match.params.invited == "linkedinInvited"  ){
    //     invitedGroupLinkedin = true;
    // }
    // if(Meteor.user() && Meteor.user().profile.loginScript ){
    //     setQuizPerson = props.match.params.invited == "invited" || props.match.params.invited == "linkedinInvited";
    //     setGroupQuizPerson = props.match.params.invited == "groupInvitation" || props.match.params.invited == "groupInvitationLinkedinUser";
       
    //    if(setQuizPerson){
    //     email = props.match.params.email;
    //     user = Connections.findOne( { "profile.emailAddress" : email });
    //     props.history.replace('/quiz');
        
    //    }

    //    if(setGroupQuizPerson){
    //     let groupId = props.match.params.invitationId;
    //     if(groupId){ props.history.replace(`/quiz/${groupId}`); }
        
    //    }
    //   }

    // return {
    //     user:user,
    //     groupLinkedinInvitedUser:invitedGroupLinkedin,
    //     linkedinInvitedUser:invitedLinkedin,
    //     setQuizPerson:setQuizPerson,
    //     setGroupQuizPerson:setGroupQuizPerson
    // };
//   })(Login);
