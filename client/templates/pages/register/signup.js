Template.signUp.events({

  'click #signIn': function (event) {
    event.preventDefault();
    //Meteor.users.update(Meteor.userId(), { '$set': { 'profile.loginScript': "init" } });
    Router.go('/signIn');
    Session.set('signUp', false);
  },

  'submit form': function(event){
   event.preventDefault();

   let registerEmail = event.target.registerEmail.value;
   let registerPassword =  event.target.registerPassword.value;
   let firstName =   event.target.firstName.value;
   let lastName =  event.target.lastName.value;

   let data = {registerEmail:registerEmail, registerPassword:registerPassword, firstName: firstName, lastName:lastName}
   let oldUser = Connections.findOne({"email":registerEmail});
   let verify = !oldUser ? false : true;

   console.log(verify); // true means invited user

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
            // Manually overriding the verified as true for the invited
            if(verify)
            {
                Meteor.call('verifiedTrue', Meteor.userId(), function (err, result) {
                  console.log(err,result);
                });
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
}


Template.signUp.helpers({
     invitedEmail(){
      if(Router.current().params.email)
        {
          return Router.current().params.email;
        }
        return null;
     }
});
