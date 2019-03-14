

Meteor.methods({
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

            GroupQuizData.remove(
              {
                "groupId": gr._id,
              });
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
