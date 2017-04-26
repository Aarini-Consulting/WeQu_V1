if(Meteor.isClient){
  Template.RecoverPassword.rendered = function(){
    $('form').parsley();
    if (Accounts._resetPasswordToken){
      Session.set('resetPasswordToken', Accounts._resetPasswordToken);
    }
  }
}

Template.RecoverPassword.helpers({  
  resetPassword: function() {
    if(Router.current() && Router.current().params.token)
    {
     return true;
    }
    return null;
  }
});

Template.RecoverPassword.events({  
  'submit #forgot-password': function(event, template) {
    event.preventDefault();
    var email = event.target.useremail.value;   //trimInput(template.find('#user-email').value),
    var message;
    $('#info').text('Please wait , processing ');
      // You will probably want more robust validation than this!
      Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          $('#info').text('');
          if (err.message === 'User not found [403]') {
            //sAlert.error('This email does not exist.');
            $('#error').text(err.message);
          } else {
            $('#error').text('We are sorry but something went wrong.');
            //sAlert.error('We are sorry but something went wrong.');
          }
        } else {
          //sAlert.success('Email Sent. Check your mailbox.');
          $('#info').text('Email Sent. Check your mailbox.');
          $('#useremail').val("");
          Session.setPersistent('useremail',email);
        }
      });
    },
    'submit #set-new-password': function (event, template) {
     event.preventDefault();

     var password = template.find('#new-password').value,
     passwordTest = new RegExp("(?=.{6,}).*", "g");

     let confirm = template.find('#confirm').value;

   if(isNonEmpty(password) && isValidConfirmPassword(password,confirm)){
    // If the password is valid, we can reset it.
    if (passwordTest.test(password)) {

      var sessmail = Session.get('useremail');
      Meteor.call('resetpassword', {useremail: sessmail, password: password}, function(err, user){
        if(err){
          sAlert.error('There was an error with reset password');
        }else{
          sAlert.success('Your password has been reset. kindly login to continue',{
                          effect: '',
                          position: 'top-right',
                          timeout: '10000',
                          onRouteClose: false
                      });
          Router.go("/signIn");
        }
      });

    } else {
       sAlert.success('Your password is too weak!');
     }
  }
 return false;
},
// newly added
'click #signIn': function (event) {
    event.preventDefault();
    //Meteor.users.update(Meteor.userId(), { '$set': { 'profile.loginScript': "init" } });
    Router.go('/signIn');
    Session.set('signUp', false);
  },


});

