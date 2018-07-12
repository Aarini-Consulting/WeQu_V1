

Meteor.methods({
  'inviteLogin' : function(token){
   var feedback = Feedback.findOne({_id : token})
   if(!feedback) return;
   if(feedback.done) return;
   var user = Meteor.users.findOne({_id : feedback.from});
   if(!user) return;
   return user.username;          //TODO: change password to login only once with token      //TODO: update email verified
 },


 'invite' : function (toName, email, gender) {

    check(toName, String);
    if(!toName){
      throw (new Meteor.Error("empty_name"));
    }

    if(!validateEmail(email)) {
      throw (new Meteor.Error("invalid_email"));
    }

    //check user, prevent sending invite to current  user's email
    var toUser = Meteor.users.findOne({$or : [ {"emails.address" : email }, { "profile.emailAddress" : email }]});
		if(toUser && toUser._id == this.userId){
			throw (new Meteor.Error("send_email_self"));
    }
    
    //check if user is already invited before
    let oldUser = Connections.findOne( 
      { $and : [{"email":email},{"inviteId": this.userId},{groupId:{$exists: false}}]});
    if(oldUser){
      throw (new Meteor.Error("already_invited"));
    }

    var profile = Meteor.user().profile;
    var name = getUserName(profile);

     //Logic profile data should take priority
    var gender_result = Meteor.user().profile.gender ? Meteor.user().profile.gender : gender

    if (gender_result  == 'Male'){
      qset = genInitialQuestionSet(name, qdata.type1he, 12);
    } else if (gender_result  == 'Female') {
      qset = genInitialQuestionSet(name, qdata.type1she, 12);
    }
    if (gender  == 'Male'){
      qset1 = genInitialQuestionSet(toName, qdata.type1he, 12);
    } else if (gender  == 'Female') {
      qset1 = genInitialQuestionSet(toName, qdata.type1she, 12);
    }

    var _id = Random.secret()
    var _id1 = Random.secret()
    var userId;

    var link;
    if(!toUser){
      userId = Accounts.createUser({
                email: email,
                password: _id,
                trial: true,
                firstName: toName,
                profile : { emailAddress : email, 
                  name: toName, 
                  // gender: gender, 
                  // inviteGender: gender_result 
                }
              });
      // link = `invitation/${_id}`;
    } 
    else {
      userId = toUser._id;
      // When an invitation send to an existing user (the account created with linkedin)
      // the email login field should not displayed
      // link = `signIn/invited/${email}/${_id}`;
      // if(toUser && toUser.services && toUser.services.linkedin){
      //   link = `signIn/linkedinInvited/${email}/${_id}`;        
      // }
    }

    link = `invitation/${_id}`;

    // inserting the inforamtion into the connections collection

    //meteor < 1.6 bug, can't use $ operator in upsert
    // Connections.upsert({
    //     userId:userId,
    //     inviteId : Meteor.userId(),
    //     groupId: {$exists: false}
    //   },
    //   {$set: {
    //     email: email,
    //     userId : userId,
    //     inviteId : Meteor.userId(),
    //     services : {invitationId: _id}
    //   }    
    // });

    var connectionCheck = Connections.findOne({
      userId:userId,
      inviteId : Meteor.userId(),
      groupId: {$exists: false}
    });

    if(!connectionCheck){
      Connections.insert({
        email: email,
        userId : userId,
        inviteId : Meteor.userId(),
        services : {invitationId: _id}
      });
    }

    // Updating the profile groupQuizPerson to false
    // let flag = false;
    // Meteor.call('updateProfileGroupQuizPerson', userId ,flag, function (err, result) {
    //         console.log("updateProfileGroupQuizPerson",err,result);
    // });
   

    var feedback = Feedback.findOne({ 'from': userId, 'to': Meteor.userId() });
    console.log("qset1 \n " ,qset1," \n");

    var fbId = Feedback.insert({_id: _id, from : userId, to: Meteor.userId(), qset : qset, invite : true, done: false });
    var fbId1 = Feedback.insert({_id: _id1, from : Meteor.userId(), to: userId, qset : qset1, invite : false, done: false });
    console.log("\n fbId1 \t ", fbId1,"\n");
    if(!toUser){
      Meteor.users.update({_id: userId}, {$set : { "services.invitationId": _id}});
    }


    var emailData = {
      'from': name,
      'to' : toName,
      'link': Meteor.absoluteUrl(link)
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


    },
    addRoleGameMaster(userId){
      if(Roles.userIsInRole(userId,'admin')){
       throw new Meteor.Error("Not allowed to assigned roles");
      }

      var checkUser = Meteor.users.findOne({'_id':userId});

      if ( Roles.userIsInRole( userId, 'GameMaster' ) ) {
        Roles.removeUsersFromRoles( userId, 'GameMaster');
        var groupsCreated =  Group.find({creatorId: userId}).count();
        //delete all group(and its associated data) created by this user 
        if(groupsCreated > 0){
          Group.find({creatorId: userId}).forEach((gr)=>{
            FeedbackRank.remove(
                { "groupId": gr._id}
              );
            
            CardPlacement.remove(
                { "groupId": gr._id},
              );
          });
  
          Group.remove(
            { "creatorId": userId},
          );
        }
      } else {
        var email = checkUser.emails[0].address;
        var subject = `Welcome to the WeQ Master Coach Community`;
        var emailData = {
        'firstName':checkUser.profile.firstName,
        };
        let body = SSR.render('GamemasterConfirmationEmail', emailData);
        Roles.addUsersToRoles(userId, "GameMaster" );
        Meteor.call('sendEmail', email, subject, body);
        
      }
    },

    addRoleGameMaster2(userId){
       Roles.addUsersToRoles(userId, "GameMaster" );
    }
})
