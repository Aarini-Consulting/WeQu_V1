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

   console.log(verify);

   Meteor.call('createAccount', data , verify, function (err, result) {

    if(err)
    { $('#error').text(err);
     console.log(err);
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
                      comment: `Congrats. ${firstName} ${lastName} accepts your invitation. Give him some feedback!`
                    }

         Meteor.call('addFeed', data, function (err, result) {
          if(err)
            {
              console.log(err);
            }
            if(result){
              console.log(result);
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
