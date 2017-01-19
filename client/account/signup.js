Template.signUp.events({

  'click #signIn': function (event) {
      Meteor.users.update(Meteor.userId(), { '$set': { 'profile.loginScript': "init" } });
  },

  'submit form': function(event){
     event.preventDefault();

     // TODO : Why Account creation is in client side , since vulnerable to attack
     // create a meteor method in server side and call it 

     Accounts.createUser({
            email: event.target.registerEmail.value,
            password: event.target.registerPassword.value,
            firstName: event.target.firstName.value,
            lastName: event.target.lastName.value
        }, function (err) {
          if(err){
            $('#error').text(err);
          }});
    }
    });
