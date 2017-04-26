  Template.signIn.events({
    'submit #signIn': function(event) {
      event.preventDefault();

      let setQuizPerson = Router.current().params && Router.current().params.invited == "invited" ? true  :false;

      // If invited person then find that persons _id and set the quiz person .
      var email, user;
      if(setQuizPerson)
      {
       email = Router.current().params && Router.current().params.email;
       user = Connections.findOne( { "profile.emailAddress" : email });
     }

     // If group invited person then find the group master _id and him as the quiz person 
     let setGroupQuizPerson = Router.current().params && Router.current().params.invited == "groupInvitation" ? true  :false;
     var groupId;
     if(setGroupQuizPerson){
       groupId = Router.current().params && Router.current().params.invitationId;
       user = Group.findOne( { _id : groupId });
     }


     Meteor.loginWithPassword(event.target.loginEmail.value, event.target.loginPassword.value, function (err) {
      if(err){
        $('#error').text(err);
      }
      else
      {
         if(setGroupQuizPerson){
          setLoginScript(false);
          let userId = Meteor.userId(); let flag = true;
          Meteor.call('updateProfileGroupQuizPerson', userId ,flag, function (err, result) {
                  console.log("updateProfileGroupQuizPerson",err,result);
          });

          Router.go(`/quiz`);
          return ;
         }

        Router.go(`/quiz`);
        if(setQuizPerson){
          setLoginScript(false);
          console.log(user);
          quizPerson.set(user.inviteId);
        }



      }
    });


   },
   'click #sign-up': function (event) {
    Router.go('/signUp');
    Session.set('signUp', true);
  },
  'click #logInLinkedIn' : function(){

  /*'click .loginLinkedin' : function(){*/

    let setQuizPerson = Router.current().params && Router.current().params.invited == "linkedinInvited" ? true  :false;

      // If invited person then find that persons _id and set the quiz person .
      var email, user;
      if(setQuizPerson)
      {
       email = Router.current().params && Router.current().params.email;
       user = Connections.findOne( { "profile.emailAddress" : email });
     }

     // If group invited person then find the group master _id and him as the quiz person 
     let setGroupQuizPerson = Router.current().params && Router.current().params.invited == "groupInvitationLinkedinUser" ? true  :false;
     var groupId;
     if(setGroupQuizPerson){
       groupId = Router.current().params && Router.current().params.invitationId;
       user = Group.findOne( { _id : groupId });
     }

     Meteor.loginWithLinkedin(function(err,result){
      if(err){
        console.log(err);
        if(err.reason === "Error: User validation failed [403]"){ 

            console.log(err.error); // Now again login ...
            let user = err.error; //Using the validateNewUser block to update services in existing user

            let email= "";
            var profile = ""
            var userName = ""; 
            if(user){
              email = user.profile.emailAddress ;
              profile = user.profile;
              userName = user.services.linkedin.firstName + user.services.linkedin.lastName;
            }

            Modal.show('emailCoupling'  , { invitedEmail: email, userName: userName, 
              setQuizPerson:setQuizPerson } ) ;                                  

          }
        }
        else
          Session.set('loginLinkedin', true);

          if(setGroupQuizPerson){
          setLoginScript(false);
          let userId = Meteor.userId(); let flag = true;
          Meteor.call('updateProfileGroupQuizPerson', userId ,flag, function (err, result) {
                  console.log("updateProfileGroupQuizPerson",err,result);
          });

          Router.go(`/quiz`);
          return ;
         }

        if(setQuizPerson){
          console.log(user);
          setLoginScript(false);
          quizPerson.set(user.inviteId);
        }
        Router.go('/quiz');
        Meteor.setTimeout(function () {
          try{
                if(Meteor.user() && Meteor.user().services){ // production issue ..

                      const {firstName, lastName}  = Meteor.user().services.linkedin;
                      Meteor.users.update({_id: Meteor.userId()},
                        {$set : { "profile.firstName": firstName, "profile.lastName": lastName }});
               }
             }
         catch(e){
                  console.log(e);
               }
         }, 1000);


      })
   }
 });
  Template.signIn.helpers({
    signUpShow: function() {
      return Session.get('signUp');
    },
    invitedEmail(){
      if(Router.current().params.email)
      {
        return Router.current().params.email;
      }
      return null;
    },
    emailDisable(){
      return !Router.current().params.email ? false : true ;
    },
    linkedinInvitedUser(){
      if( Router.current() && ( Router.current().params.invited == "linkedinInvited" ||  
          Router.current().params.invited == "groupInvitationLinkedinUser"  ) )
      {
        return false;
      }
      return true;
    }

  });