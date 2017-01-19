Template.signIn.events({
    'submit #signIn': function(event) {
        event.preventDefault();
        Meteor.loginWithPassword(event.target.loginEmail.value, event.target.loginPassword.value, function (err) {
          if(err){
            $('#error').text(err);
          }
          else
          {
            Router.go('/quiz');
          }
        });
    },
    'click #signUp': function (event) {
      Router.go('/signUp');
      Session.set('signUp', true);
    },
    'click .loginLinkedin' : function(){
            Meteor.loginWithLinkedin(function(err){
                if(err)
                    console.log("login", err);
                else
                setLoginScript("quiz");
            })
    }
});
Template.signIn.helpers({
  signUpShow: function() {
    return Session.get('signUp');
  },
});
