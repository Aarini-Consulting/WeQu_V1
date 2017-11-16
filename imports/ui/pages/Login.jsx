import React from 'react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

class Login extends React.Component {

    // loginWithLinkedin() {
    //     // If invited person then find that persons _id and set the quiz person .
    //     var email, user;
    //     if(this.props.setQuizPerson)
    //     {
    //     email =  this.props.match.params.email;;
    //     user = Connections.findOne( { "profile.emailAddress" : email });
    //     }

    //     // If group invited person then find the group master _id 
    //     let setGroupQuizPerson = Router.current().params && Router.current().params.invited == "groupInvitationLinkedinUser" ? true  :false;
    //     var groupId;
    //     if(setGroupQuizPerson){
    //     groupId = Router.current().params && Router.current().params.invitationId;
    //     user = Group.findOne( { _id : groupId });
    //     }

    //     Meteor.loginWithLinkedin(function(err,result){
    //     if(err){
    //     console.log(err);
    //     if(err.reason === "Error: User validation failed [403]"){ 

    //         console.log(err.error); // Now again login ...
    //         let user = err.error; //Using the validateNewUser block to update services in existing user

    //         let email= "";
    //         var profile = ""
    //         var userName = ""; 
    //         if(user){
    //             email = user.profile.emailAddress ;
    //             profile = user.profile;
    //             userName = user.services.linkedin.firstName + user.services.linkedin.lastName;
    //         }

    //         Modal.show('emailCoupling'  , { invitedEmail: email, userName: userName, 
    //             setQuizPerson:setQuizPerson } ) ;                                  

    //         }
    //     }
    //     else
    //         Session.set('loginLinkedin', true);

    //     if(setGroupQuizPerson){
    //         setLoginScript(false);
    //         let userId = Meteor.userId(); let flag = true;
    //         Meteor.call('updateProfileGroupQuizPerson', userId ,flag, function (err, result) {
    //         console.log("updateProfileGroupQuizPerson",err,result);
    //         });

    //         Router.go(`/quiz`);
    //         return ;
    //     }

    //     if(setQuizPerson){
    //         console.log(user);
    //         setLoginScript(false);
    //         quizPerson.set(user.inviteId);
    //     }
    //     Router.go('/quiz');
    //     Meteor.setTimeout(function () {
    //         try{
    //             if(Meteor.user() && Meteor.user().services){ // production issue ..

    //                 const {firstName, lastName}  = Meteor.user().services.linkedin;
    //                 Meteor.users.update({_id: Meteor.userId()},
    //                 {$set : { "profile.firstName": firstName, "profile.lastName": lastName }});
    //             }
    //             }
    //             catch(e){
    //             console.log(e);
    //             }
    //         }, 1000);


    //     })
    // }

    login(loginEmail, loginPassword){
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
    
                props.history.replace(postLoginRedirect);
            }else{
                props.history.replace('/');
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
                    
                            <a id="logInLinkedIn" className="linkedinbttn w-button" href="#" >Log In With LinkedIn</a>
                        
                            <div style={{visibility:this.props.groupLinkedinInvitedUser ? 'hidden' : 'visible'}} className="w-form">

                            <form className="loginemail" data-name="Email Form" id="signIn" name="email-form">
                                <input className="emailfield w-input" maxLength="256" name="loginEmail" placeholder="email address" type="email" defaultValue={this.props.invitedEmail}  required style={{textTransform:"lowercase"}}/>
                                <input className="emailfield w-input" maxLength="256" name="loginPassword" placeholder="password" required="required" type="password"/>
                                <a className="linktext" href="/RecoverPassword">Forgotten password?</a>
                                <input className="submit-button w-button" data-wait="Please wait..." type="submit" defaultValue="Log In With Email"/>
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

export default withTracker((props) => {
    console.log(Session.get("loginRedirect"));
    var dataReady;
    var handle = Meteor.subscribe('connections', props.secret, {
        onError: function (error) {
                console.log(error);
            }
        });
    dataReady = handle.ready();
    
    var invitedGroupLinkedin = false;
    var invitedLinkedin = false;
    var setQuizPerson = undefined;
    var setGroupQuizPerson = undefined;
    var user = undefined;

    if(props.match.params.invited == "groupInvitationLinkedinUser"  ){
        invitedGroupLinkedin = true;
    }

    if(props.match.params.invited == "linkedinInvited"  ){
        invitedGroupLinkedin = true;
    }
    if(Meteor.user() && Meteor.user().profile.loginScript ){
        setQuizPerson = props.match.params.invited == "invited" || props.match.params.invited == "linkedinInvited";
        setGroupQuizPerson = props.match.params.invited == "groupInvitation" || props.match.params.invited == "groupInvitationLinkedinUser";
       
       if(setQuizPerson){
        email = props.match.params.email;
        user = Connections.findOne( { "profile.emailAddress" : email });
        props.history.push('/quiz');
        
       }

       if(setGroupQuizPerson){
        let groupId = props.match.params.invitationId;
        if(groupId){ props.history.push(`/quiz/${groupId}`); }
        
       }
      }

    return {
        user:user,
        groupLinkedinInvitedUser:invitedGroupLinkedin,
        linkedinInvitedUser:invitedLinkedin,
        setQuizPerson:setQuizPerson,
        setGroupQuizPerson:setGroupQuizPerson
    };
  })(Login);
