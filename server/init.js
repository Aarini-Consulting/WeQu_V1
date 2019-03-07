
Meteor.startup(function () {

  // if (Meteor.isServer) {
  //     Meteor.startup(function () {
  //         WebApp.rawConnectHandlers.use(function (req, res, next) {
  //             res.setHeader('cache-control', 'no-cache');
  //             res.setHeader('expires', '0');
  //             res.setHeader('Content-Type', 'text/html');
  //             res.setHeader('charset', 'utf-8');
  //             next();
  //         });
  //     });
  // }

  WebApp.rawConnectHandlers.use(function (req, res, next) {
      res.setHeader('cache-control', 'no-cache');
      res.setHeader('expires', '0');
      next();
  });
  
   // Linked in configuration
  //  var clientId,secret;
  //   if(Meteor.isDevelopment)
  //   {
  //       clientId = "81c7xemys60qav";
  //       secret = "SrqKYk5zbL9nZ0xz";
  //   }
  //   if(Meteor.isProduction){
  //       clientId = "758ew0beoeqe01";
  //       secret = "qwAMdc8wlJ3KxgY1";
  //   }

  //   Accounts.loginServiceConfiguration.upsert({
  //       service: 'linkedin'
  //     }, 
  //     {$set: {
  //       service: 'linkedin',
  //       clientId:clientId,
  //       secret: secret,
  //       loginStyle: 'popup'
  //       }
  //     } 
  //   );

    // On Creating user gives a call back function
    Accounts.onCreateUser(function (options, user) {
        user.profile = options.profile || {};
        user.profile.firstName = options.firstName;
        user.profile.lastName = options.lastName;

        if(options.userType){
            user.profile.userType = options.userType;
        }

        if(options.trial){
            user.profile.trial = options.trial; // account created by user then set to false
        }

        return user;

    });

    });
