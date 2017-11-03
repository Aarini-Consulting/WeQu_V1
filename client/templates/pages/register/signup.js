 
Template.signUp.events({

  'click #signIn': function (event) {
    event.preventDefault();
    //Meteor.users.update(Meteor.userId(), { '$set': { 'profile.loginScript': "init" } });
    //Router.go('/signIn');
    Router.go('/');
    Session.set('signUp', false);
  },

  'click #linkedinSignupbttn' : function(){

    let setQuizPerson = Router.current().params && Router.current().params.invited == "linkedinInvited" ? true  :false;

      // If invited person then find that persons _id and set the quiz person .
      var email, user;
      if(setQuizPerson)
      {
       email = Router.current().params && Router.current().params.email;
       user = Connections.findOne( { "profile.emailAddress" : email });
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
   },

  'click #terms': function (event) {
    event.preventDefault();
    Router.go('/terms');
   },

   'click #privacyPolicy': function (event) {
    event.preventDefault();
    Router.go('/privacyPolicy');
   },

  'submit form': function(event){

   event.preventDefault();

   let registerEmail = event.target.registerEmail.value.toLowerCase();
   let registerPassword =  event.target.registerPassword.value;
   let firstName =   event.target.firstName.value;
   let lastName =  event.target.lastName.value;

   let data = {registerEmail:registerEmail, registerPassword:registerPassword, firstName: firstName, lastName:lastName}
   let oldUser = Connections.findOne({"email":registerEmail});
   let verify = !oldUser ? false : true;

   console.log(verify); // true means invited user

   // If group invited person then find the group master _id 
   var setGroupQuizPerson = Router.current().params && Router.current().params.invited == "groupInvitation" ? true  :false;
   var groupId;
   if(setGroupQuizPerson){
     groupId = Router.current().params && Router.current().params.invitationId;
     user = Group.findOne( { _id : groupId });
   }

   Meteor.call('createAccount', data , verify, function (err, result) {

   if(err)
   { 
       // Existing invited user  tries to create account , allow him to login directly
       //If he has valid invitaion id then , we are allowing him to proceed
       let invitationId = Router.current().params.invitationId ? Router.current().params.invitationId : ''  ; 
       var user =  Meteor.users.findOne({
                                           $and : [
                                               { 'services.invitationId' : invitationId },{'emails.0.address': registerEmail},
                                               {'profile.trialMember': false }
                                              ]
                                             });
       let validUser = !user ? false : true // true then he has enough valid data 

       // TODO : Allow for only one time per user ..

       if(err.message = "Email already exists." && verify && validUser)
       {    

        if(validUser)
        {             
                let data =  {userId: user._id, firstName: firstName , lastName: lastName }

                Meteor.call('updateProfile', data , function (err, result) {
                        console.log("updateProfile",err,result);
                });

                Meteor.call('setPassword', user._id ,registerPassword,  { logout: false } ,function (err, result) {
                        console.log("setPassword",err,result);
                });


                Meteor.loginWithPassword(registerEmail, registerPassword , function (err) {
                    if(err){
                      $('#error').text(err);
                    }
                    else
                    {
                      // Manually overriding the verified as true for the invited
                    //  if(verify)
                      {
                          Meteor.call('verifiedTrue', Meteor.userId(), function (err, result) {
                            console.log(err,result);
                          });
                      }
                      Router.go('/quiz');
                      
                    }
                  });
        }


       }
       else
       {
        $('#error').text(err.reason);
        console.log(err);
       }


   }
    else if(result)
    {
     Meteor.loginWithPassword(registerEmail, registerPassword , function (err) {
          if(err){
            $('#error').text(err);
          }
          else
          {
            // Manually overriding the verified as true for the invited & group member
            if(verify || setGroupQuizPerson)
            {
                Meteor.call('verifiedTrue', Meteor.userId(), function (err, result) {
                  console.log(err,result);
                });
            }

             if(setGroupQuizPerson){
                Meteor.call('gen-question-set', Meteor.userId(), function (err, result) {
                  console.log('gen-question-set', err, result);
                });
                setLoginScript(false);
                let userId = Meteor.userId(); let flag = true;
                Meteor.call('updateProfileGroupQuizPerson', userId ,flag, function (err, result) {
                        console.log("updateProfileGroupQuizPerson",err,result);
                });

                Router.go(`/quiz/${groupId}`);
                return ;
              }


            Router.go('/quiz');
            
          }
        });

       // Insert data into Feeds collection during invited user onboarding

       if(verify){
         let data = { inviteId : oldUser.inviteId,
                      type : 0,
                      statement1: `Congrats. ${firstName} ${lastName} accepts your invitation. Give him some feedback!`
                    }

         Meteor.call('addFeedType0', data, function (err, result) {
          if(err)
            {
              console.log(err);
            }
         });
       }

   }
 });
 }

});



Template.signUp.rendered = function(){
  $('.menuBar').hide();
  Session.clear('invite');

   Tracker.autorun(function () {
        
        if(getLoginScript() == false && Meteor.user()!=undefined ){
          let setQuizPerson = Router.current().params && Router.current().params.invited == "invited" ? true  :false;
          let setGroupQuizPerson = Router.current().params && Router.current().params.invited == "groupInvitation" ? true  :false;
         
         if(setQuizPerson){
          email = Router.current().params && Router.current().params.email;
          user = Connections.findOne( { "profile.emailAddress" : email });
          Router.go('/quiz');
          quizPerson.set(user.inviteId);
         }

         if(setGroupQuizPerson){
          let groupId = Router.current().params && Router.current().params.invitationId;
          Router.go(`/quiz/${groupId}`);
         }
        }

    });

}


Template.signUp.helpers({
     invitedEmail(){
      if(Router.current().params.email)
        {
          return Router.current().params.email;
        }
        return null;
     },
     emailDisable(){
      return !Router.current().params.email ? false : true ;
     }
});




