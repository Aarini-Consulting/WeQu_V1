// Meteor.publish('user', (userId) => {
//   return  Meteor.users.find({_id : userId});
// });

// Meteor.publish('users', function () {
//   return Meteor.users.find({});  
// });
import { Random } from 'meteor/random';
import {sendEmail} from './emailNotifications';

import {Group} from '/collections/group';
import {GroupQuizData} from '/collections/groupQuizData';
import {FeedbackRank} from '/collections/feedbackRank';
import {CardPlacement} from '/collections/cardPlacement';
import {PlayCard} from '/collections/playCard';

Meteor.publish('usersFiltered', function(selector, options) {
  return Meteor.users.find(selector, options);
});

Meteor.publish('users', function(selector, options) {
  return Meteor.users.find(selector, options);
});


Meteor.methods({
  'change.email.verify'(token) {
    var user = Meteor.users.findOne(
      { "services.email.updateVerificationTokens.token": token}
    );
    if(user){
      Meteor.call( 'user.update.email',user, user.services.email.updateVerificationTokens[0].address);

      Meteor.users.update({_id : user._id}, 
        {$set: 
          {"services.email.updateVerificationTokens" :[]}
        }
      );
    }else{
      throw new Meteor.Error("invalid_token");
    }
  },
  'change.email.verification.send'(email) {
    if(this.userId){
      var checkEmail = Meteor.users.find({_id:{$ne:this.userId},"emails.0.address":email}).fetch();

      if(checkEmail.length > 0){
        throw new Meteor.Error("email already in use");
      }

      var user = Meteor.users.findOne(this.userId);

      if(user){
        var verificationToken = user && user.services && user.services.email 
        && user.services.email.updateVerficationTokens 
        && user.services.email.updateVerficationTokens.length > 0
        && user.services.email.updateVerficationTokens[0];

        var secret = Random.secret();
        if(!verificationToken){
          Meteor.users.update({_id : user._id}, 
            {$set: 
              {"services.email.updateVerificationTokens" :
                [{
                  "token":secret,
                  "address":email,
                  "when":new Date()
                }]
              }
            }
          );
        }
        else{
          Meteor.users.update({_id : user._id}, 
            {$addToSet: 
              {"services.email.updateVerificationTokens" :
                {
                  "token":secret,
                  "address":email,
                  "when":new Date()
                }
              }
            }
          );
        }

        var link = `update-email/${secret}`;
        var emailData = {
          'email': email,
          'link': Meteor.absoluteUrl(link),
        };

        var firstName = user && user.profile && user.profile.firstName;
        var lastName = user && user.profile && user.profile.lastName;
        var subject;
        if(firstName && lastName){
          subject = `[WeQ] Confirm your account, ${firstName+" "+lastName}`;
        }else{
          subject = '[WeQ] Confirm your account';
        }
        
        let body = SSR.render('EmailChangeVerification', emailData);
        
        sendEmail(email, subject, body);
      }
    }
  },
  'store.profile.picture'(base64String) {
    Meteor.users.update(this.userId, { 
      '$set': {
          'profile.pictureUrl': base64String,
          'profile.pictureShape': "square"
          } 
      });
  },
  'user.update.name'(firstName, lastName) {
    Meteor.users.update(this.userId, { 
      '$set': {
          // 'profile.name': firstName,
          'profile.firstName': firstName,
          'profile.lastName': lastName,
          } 
      });
  },
  'user.update.email'(currentUser, email) {
    var currentUser = Meteor.users.findOne({_id:currentUser._id});
    var userId = currentUser._id;

    if(currentUser){
      var checkEmail = Meteor.users.find({_id:{$ne:userId},"emails.0.address":email}).fetch();

      if(checkEmail.length > 0){
        throw new Meteor.Error("email already in use");
      }
      
      Meteor.users.update(userId, { 
        '$set': {
            'emails.0.address': email,
            } 
        });
    }
  },
  'user.set.self.rank'(id, groupId) {
    let groupCheck = Group.findOne({_id:groupId});

    var userIdsSurveyed = groupCheck.userIdsSurveyed;
    if(!userIdsSurveyed || (userIdsSurveyed && userIdsSurveyed.indexOf(id) == -1)){
      Meteor.users.update(id, { 
        '$set': {
            'profile.selfRank': groupId,
            } 
        });
    }
  },
  'user.update.gender'(gender) {
    Meteor.users.update(this.userId, { 
      '$set': {
          'profile.gender': gender,
          } 
      });
  },
  'user.set.locale'(locale) {
    if(this.userId){
      Meteor.users.update({_id: this.userId}, 
        {$set: {
          "profile.locale": locale,
        }});
    }
  },
  'user.delete'() {
    var currentUser = Meteor.users.findOne({_id:this.userId});
    var userId = currentUser._id;

    if(currentUser){
      var groupOwnedByUser = Group.find({"creatorId":currentUser._id}).fetch();
      if(groupOwnedByUser.length > 0){
        throw new Meteor.Error("not allowed to delete groupowner");
      }
      Group.find(
        {$or : [
            { "userIds": userId},
            { "userIdsSurveyed": userId},
            { "userIdsSelfRankCompleted": userId}
          ] 
        }
      ).forEach(function(gr){
        var doUpdate = false;

        if(gr.userIds){
          var check = gr.userIds.indexOf(userId);

          if(check > -1){
            gr.userIds.splice(check, 1);
            doUpdate = true;
          }
        }

        if(gr.userIdsSurveyed){
          var check = gr.userIdsSurveyed.indexOf(userId);

          if(check > -1){
            gr.userIdsSurveyed.splice(check, 1);
            doUpdate = true;
          }
        }

        if(gr.userIdsSelfRankCompleted){
          var check = gr.userIdsSelfRankCompleted.indexOf(userId);

          if(check > -1){
            gr.userIdsSelfRankCompleted.splice(check, 1);
            doUpdate = true;
          }
        }

        if(doUpdate){
          Group.update(
            {_id:gr._id},
            {$set: gr}
          );
        }
      });

      FeedbackRank.remove(
        {$or : [
          { "from": currentUser._id},
          { "to": currentUser._id}
          ] 
        });
      
      CardPlacement.remove(
        {
          "userId": currentUser._id
        });

      GroupQuizData.remove(
        {
          "creatorId": currentUser._id,
        });

      PlayCard.remove(
        {$or : [
          { "from": currentUser._id},
          { "to": currentUser._id}
          ] 
        });

      Meteor.users.remove({_id:this.userId});
    }else{
      throw new Meteor.Error("unknown user");
    }
  },
})
