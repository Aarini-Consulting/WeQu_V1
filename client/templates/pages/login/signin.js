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
        if(err){
          //TODO : Using the validateNewUser block to update services in existing user 
          // Now again login ...
          console.log(err);
              if(err == "Error: User validation failed [403]"){
                  let email= prompt("Please enter your email", "");
                  var password = prompt("Please enter your password", "");
                  if (!password || !email) {
                    $('#error').text("Please provide email && password to continue");             
                  }
                  else
                  {
                      Meteor.loginWithPassword(email,password, function (err) {
                      if(err){
                        $('#error').text(err);
                      }
                      else
                      {
                        Router.go('/quiz');
                      }
                    });
                  }
                }
                $('#error').text(err);
        }
       else
        Session.set('loginLinkedin', true);
        //  setLoginScript("init");
         Router.go('/quiz');

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
