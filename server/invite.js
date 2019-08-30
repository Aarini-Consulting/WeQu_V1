import {sendEmail} from './emailNotifications';
import {Group} from '/collections/group';
import {GroupQuizData} from '/collections/groupQuizData';
import {FeedbackRank} from '/collections/feedbackRank';
import {CardPlacement} from '/collections/cardPlacement';
import {PlayCard} from '/collections/playCard';

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

            PlayCard.remove(
                { "groupId": gr._id},
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

        if(Roles.userIsInRole( userId, 'TrialGameMaster' )){
          Roles.removeUsersFromRoles(userId, "TrialGameMaster" );
        }
        
        sendEmail(email, subject, body);
        
      }
    },

    addRoleTrialGameMaster(userId){
      var groupCreator = Meteor.users.findOne(userId);

      Roles.addUsersToRoles(userId, "TrialGameMaster" );
      var emailSubject = "Congratulations! Your account is upgraded";

      var emailData = {
        'creatorName' : (groupCreator.profile.firstName +" "+ groupCreator.profile.lastName),
      };
      var body;
      body = SSR.render('GroupUpgradeNorming', emailData);
      sendEmail(groupCreator.emails[0].address, emailSubject, body);
    }
})
