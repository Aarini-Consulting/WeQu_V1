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
    'click #sign-up': function (event) {
      Router.go('/signUp');
      Session.set('signUp', true);
    },
    'click .loginLinkedin' : function(){
      Meteor.loginWithLinkedin(function(err,result){
        if(err)
         $('#error').text(err);
       else
        Session.set('loginLinkedin', true);
      setLoginScript("init");

      Meteor.setTimeout(function () {
                  try{
                    // production issue ..
                    if(Meteor.user() && Meteor.user().services){

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
  });

  Template.signIn.rendered = function(){
    $('.menuBar').hide();
  }
