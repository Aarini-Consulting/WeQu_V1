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
   let oldUser = Connections.findOne({"emails.address":registerEmail});
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