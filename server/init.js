
Meteor.startup(function () {

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


    Accounts.validateNewUser(function (user) {
        // TODO : On invited user onboarding , if his email id , already registered with the system .
        // Then copy the services object , update in existing account.

        if(user.services && user.services.linkedin && user.services.linkedin.emailAddress )
        {
          let email = user.services.linkedin.emailAddress;
          let existingUser = Meteor.users.findOne({$or : [ {"emails.address" : email }, { "profile.emailAddress" : email  }]});
          let exists = !existingUser ? false  :true ;
          if(exists){
            let linkedin = user.services.linkedin ;
           // user.services.linkedin = ""; // Doing this to avoid --- Duplicate id exists --- 
           
              Meteor.setTimeout(function () {
              try{
                 console.log("\n -------- linkedin ---------- \n ",linkedin);
                 Meteor.users.update({_id: existingUser._id}, {$set: {'services.linkedin' : linkedin  } });         
              }
              catch(e){
                console.log(e);
              }
             },2000);
            // return false;
             throw new Meteor.Error( user, "Error: User validation failed [403]");
          }
        }

      return true;

    });

    // On Creating user gives a call back function
    Accounts.onCreateUser(function (options, user) {
        user.profile = options.profile || {};
        user.profile.loginScript = 'init';
        user.profile.gradient = Math.floor(Math.random() * 5) + 1;
        user.profile.firstName = options.firstName;
        user.profile.lastName = options.lastName;

        if(options.trialMember){
            user.profile.trialMember = options.trialMember;
            user.profile.trial = options.trial; // account created by user then set to false
        }

        console.log('----- \n onUserCreated ---------- \n', user);

        return user;

    });

   // Accounts.config({sendVerificationEmail: true, forbidClientAccountCreation: false});

    });
