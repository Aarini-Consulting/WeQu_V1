Template.signUp.events({

  'click #signIn': function (event) {
    event.preventDefault();
    Meteor.users.update(Meteor.userId(), { '$set': { 'profile.loginScript': "init" } });
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

   Meteor.call('createAccount', data , function (err, result) {

    if(err)
    { $('#error').text(err);
     console.log(err);
   }
    else if(result)
    {
     Router.go('/script-login');
   }
 });
 }

});



Template.signUp.rendered = function(){
  $('.menuBar').hide();
}
