

Meteor.methods({
  'inviteLogin' : function(token){
   var feedback = Feedback.findOne({_id : token})
   if(!feedback) return;
   if(feedback.done) return;
   var user = Meteor.users.findOne({_id : feedback.from});
   if(!user) return;
   return user.username;
           //TODO: change password to login only once with token
           //TODO: update email verified
         },
         'invite' : function (toName, email, gender) {
          check(Meteor.userId(), String);
          if(!toName){
            throw (new Meteor.Error("empty_name"));
          }

          if(!validateEmail(email)) {
            throw (new Meteor.Error("invalid_email"));
          }
          var profile = Meteor.user().profile;
          var name = getUserName(profile);

        //Logic profile data should take priority
        var gender_result = Meteor.user().profile.gender ? Meteor.user().profile.gender : gender

        if (gender_result  == 'Male'){
          qset = genInitialQuestionSet(name, qdata.type1he, 10);
        } else if (gender_result  == 'Female') {
          qset = genInitialQuestionSet(name, qdata.type1she, 10);
        }
        if (gender  == 'Male'){
          qset1 = genInitialQuestionSet(toName, qdata.type1he, 10);
        } else if (gender  == 'Female') {
          qset1 = genInitialQuestionSet(toName, qdata.type1she, 10);
        }
        var user = Meteor.users.findOne({$or : [ {"emails.address" : email }, { "profile.emailAddress" : email }]});
        var _id = Random.secret()
        var _id1 = Random.secret()
        var userId;
        if(! user){
          var username = Random.id();
          userId = Accounts.createUser({
            username: username,
            email: email,
            password: _id,
            profile : { emailAddress : email, name: toName, gender: gender, inviteGender: gender_result}
          });

        } else {
          userId = user._id;
        }

        // inserting the inforamtion into the connections collection

        Connections.insert({username: username,
          email: email,
          password: _id,
          userId : userId,

          inviteId : Meteor.userId(),
          inviteName : name,

          services : {invitationId: _id},
          profile : { emailAddress : email, name: toName, gender: gender, inviteGender: gender_result}
        });

        var feedback = Feedback.findOne({ 'from': userId, 'to': Meteor.userId() });

        var fbId = Feedback.insert({_id: _id, from : userId, to: Meteor.userId(), qset : qset, invite : true, done: false });
        var fbId1 = Feedback.insert({_id: _id1, from : Meteor.userId(), to: userId, qset : qset1, invite : false, done: false });
        if(!user){
          Meteor.users.update({_id: userId}, {$set : { "services.invitationId": _id}});
        }

       /* Email.send({
          'to': email,
          'from': 'WeQu <info@wequ.co>',
          'subject': _.template("Let’s learn from each other")({ to: toName, from:name }),
          html: SSR.render('htmlEmail', emailData),
        });
        */
        var emailData = {
          'from': name,
          'to' : toName,
          'link': Meteor.absoluteUrl('invitation/' + _id)
        };

        // Sending Email through custom server method 
        let sendtoEmail = email;
        let subject = _.template("Let’s learn from each other")({ to: toName, from:name });
        let body = SSR.render('htmlEmail', emailData);

        Meteor.call('sendEmail', sendtoEmail, subject, body , function(err, result){
              if(err){
                console.log(err);
              }
              if(result)
              {
              console.log(result,'send notification message complete');
              }

        });



        return userId;
      }
    })
