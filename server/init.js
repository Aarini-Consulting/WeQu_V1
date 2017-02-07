
Meteor.startup(function () {

   // SMTP Configuration
   process.env.MAIL_URL = 'smtp://postmaster@wequ.co:3055595afb57b03693562aceb84ad359@smtp.mailgun.org:587';

   // Linked in configuration
   var clientId,secret;
    if(Meteor.isDevelopment)
    {
        clientId = "81c7xemys60qav";
        secret = "SrqKYk5zbL9nZ0xz";
    }
    if(Meteor.isProduction){
        clientId = "758ew0beoeqe01";
        secret = "qwAMdc8wlJ3KxgY1";
    }

    Accounts.loginServiceConfiguration.upsert({
        service: 'linkedin'
      }, {
        service: 'linkedin',
        clientId:clientId,
        secret: secret,
        loginStyle: 'popup'
      });

    // On Creating user gives a call back function 
    Accounts.onCreateUser(function (options, user) {
        user.profile = options.profile || {};
        user.profile.loginScript = 'init';
        user.profile.gradient = Math.floor(Math.random() * 5) + 1;
        user.profile.firstName = options.firstName;
        user.profile.lastName = options.lastName;

        console.log('onUserCreated', user);
        return user;

    });

    Accounts.config({sendVerificationEmail: true, forbidClientAccountCreation: false}); 

    });

