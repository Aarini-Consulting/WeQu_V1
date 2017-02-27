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

   let verified = Router.current().params.invited && Router.current().params.invited == "invited" ? true : false;

   console.log(verified);

   Meteor.call('createAccount', data , function (err, result) {

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
            if(verified)
            { 
                Meteor.call('verifiedTrue', Meteor.userId(), function (err, userId) {
                  if(err){
                      console.log("error", err);
                  }
                });
            }
            Router.go('/quiz');
          }
        });
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