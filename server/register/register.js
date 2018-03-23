
Meteor.methods({


    'resetpassword': function (user) {
        var userid = Accounts.findUserByEmail(user.useremail)._id;
        Accounts.setPassword(userid, user.password);
        return {userId: userid};
    },
    'setpassword': function (user) {
        Accounts.setPassword(user.userid, user.password, {logout: false});
        return {user: user};
    },

    'findUserByEmail': function (user) {
        if (Accounts.findUserByEmail(user.email)) {
            return true;
        }
        return false;
    },

    'isAccountVerified': function (user) {

       // Based on the settings , verifyEmail can be tuned . 

       /* var verifyEmail = Meteor.settings.private.verifyEmail;
        verifyEmail = (verifyEmail == "true");

        if(!verifyEmail){
            return true;
        }
        */

        var account = Accounts.findUserByEmail(user.email);
        if(account){
            return account.emails[0].verified;
        }
        return null;
    },
     'validateToken': function (user) {
        var currentUser = Meteor.users.findOne({'services.email.verificationTokens.token': user.token});
        if (!currentUser) {
            return false;
        }
        else {
            var loggedUser = Accounts.findUserByEmail(user.email);
            if (loggedUser && loggedUser._id == currentUser._id) {

                //Sign Up: Registration Confirmed

                var sendtoEmail = user.email;
                var subject="Welcome to WeQ";
                var url=Meteor.settings.public.domain.int;
                var body="Welcome<br> Your email address is now confirmed. <a href=\""+url+"\"> Click here </a> to go to your dashboard.<br><br><br><br>Happy Quotient<br>";
                

                Meteor.call('sendEmail', sendtoEmail, subject, body , function(err, result){
                      if(err){
                        console.log(err);
                      }
                      if(result)
                      {
                      console.log(result,'send notification message complete');
                      }

                });

               

                return currentUser._id;
            }
            else {
                return false;
            }
        }
    },

});