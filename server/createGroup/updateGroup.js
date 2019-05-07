import {genGroupUserUpFront} from './createGroup';
import {sendEmail, getGroupInviteHtmlTemplate} from '../emailNotifications';
import { generateSelfRank } from '../category';

import {Group} from '/collections/group';
import {GroupQuizData} from '/collections/groupQuizData';
import {FeedbackRank} from '/collections/feedbackRank';
import {CardPlacement} from '/collections/cardPlacement';
import { CardChosen } from '/collections/cardChosen';

Meteor.methods({
    'updateGroup' : function (group, language="en", data, arr_emails) {
        var groupId = group._id;
        let groupCheck = Group.findOne({_id:groupId});

        var groupCreator = Meteor.users.findOne(this.userId);
        
        if(!groupCheck){
        throw (new Meteor.Error("group doesn't exist")); 
        }

        if(groupCheck.creatorId != this.userId){
            throw (new Meteor.Error("only owner can modify group")); 
        }

        var gmCheck = Roles.userIsInRole( this.userId, 'GameMaster' );

        if(!gmCheck){
        throw (new Meteor.Error("only_gamemaster_can_create_group")); 
        }


        //create user in db as necessary
        genGroupUserUpFront(arr_emails, undefined, data);

        //get users from email
        var users = Meteor.users.find({$or : [ {"emails.address" : {$in:arr_emails}}, { "profile.emailAddress" : {$in:arr_emails} }]}).fetch();
        var userIdsList = users.map( (user) => user._id);

        var newUsersInGroup = users.filter((user)=>{
            return groupCheck.userIds.indexOf(user._id) < 0
        })


        //create new user's self rank feedback
        newUsersInGroup.forEach(function(user, index, _arr) {

            generateSelfRank(user._id, groupCheck._id);
            
            var userEmail = user.emails[0].address;

            var link = `group-invitation/${userEmail}/${groupCheck._id}`
  
            var subject = `[WeQ] Invitation to join the group "${groupCheck.groupName}"` ;
            var message = `Please join the group by clicking the invitation link ${link}`
        
            var emailData = {
              'creatorEmail': groupCreator.emails[0].address,
              'link': Meteor.absoluteUrl(link),
              'groupName': groupCheck.groupName
            };
        
            let body = getGroupInviteHtmlTemplate(emailData, language);

            sendEmail(userEmail, subject, body);
        });

        var removedUsers = groupCheck.userIds.filter((uid)=>{
            return userIdsList.indexOf(uid) < 0
        })
        var updatedUserIdsSurveyed;
        if(removedUsers && removedUsers.length > 0 && groupCheck.userIdsSurveyed){
            updatedUserIdsSurveyed = groupCheck.userIdsSurveyed.filter((uid)=>{
                return removedUsers.indexOf(uid) < 0
            })
        }

        var updatedUserIdsSelfRankCompleted;
        if(removedUsers && removedUsers.length > 0 && groupCheck.userIdsSelfRankCompleted){
            updatedUserIdsSelfRankCompleted = groupCheck.userIdsSelfRankCompleted.filter((uid)=>{
                return removedUsers.indexOf(uid) < 0
            })
        }
        

        if(removedUsers.length > 0){
            var users = Meteor.users.find(
                {"_id":{$in:removedUsers}}
            ).fetch();

            users.forEach((user) => {
                FeedbackRank.remove({
                    $or : [ {"from" : user._id  }, 
                            { "to" : user._id}],
                            
                    'groupId': groupCheck._id,
                })

                Meteor.users.update({
                    "$and": [ 
                        {  '_id':user._id }, 
                        {  'profile.selfRank': groupCheck._id} 
                    ]}, 
                    {$unset : { "profile.selfRank": "" }});
            });
        }

        Group.update({"_id":groupId},
        {'$set':{userIds:userIdsList , creatorId: group.creatorId, groupLanguage:language}
        });

        if(updatedUserIdsSurveyed){
            Group.update({"_id":groupId},
            {'$set':{userIdsSurveyed: updatedUserIdsSurveyed, groupLanguage:language}
            });	
        }

        if(updatedUserIdsSelfRankCompleted){
            Group.update({"_id":groupId},
            {'$set':{userIdsSelfRankCompleted: updatedUserIdsSelfRankCompleted, groupLanguage:language}
            });	
        }

        // Meteor.call('genGroupQuestionSet', newEmailInGroup , groupId , newData, groupName, (err, result)=> {
        //     //  console.log("genGroupQuestionSet" , err, result);
        //         if(err){ return err}
        //     });
        
        return newUsersInGroup.length;

    },
    'resend.group.invite' : function (groupId,language="en",email) {
        let check = Group.findOne({_id:groupId});
    
        if(check){
            let groupCreator = Meteor.users.findOne({'_id':check.creatorId});
            
            if(!check){
                throw (new Meteor.Error("group_creator_missing")); 
            }

            var emailTarget = Meteor.users.findOne({'emails.0.address': email});

            if(!emailTarget){
                throw (new Meteor.Error("user_not_found")); 
            }

            if(check.userIds.indexOf(emailTarget._id) < 0){
                throw (new Meteor.Error("email_not_group_member")); 
            }

            if(check && check.groupLanguage != language){
                Group.update({"_id":groupId},
                    {'$set':{groupLanguage:language}
                });
            }
            
            var link = `group-invitation/${email}/${groupId}`
                
            var subject = `[WeQ] Invitation to join the group "${check.groupName}"` ;
            var message = `Please join the group by clicking the invitation link ${link}`
        
            var emailData = {
            'creatorEmail': groupCreator.emails[0].address,
            'link': Meteor.absoluteUrl(link),
            'groupName': check.groupName
            };
        
            let body = getGroupInviteHtmlTemplate(emailData, language);

            // Meteor.call('send.notification', (error, result) => {
            //     console.log(error);
            //     console.log(result);
            // });

            sendEmail(email, subject, body);

            return true;

        }else{
            throw (new Meteor.Error("group doesn't exist")); 
        }
    },
    'delete.group' : function (groupId) {
        var checkUser = Meteor.users.findOne({_id: this.userId});

        if(checkUser && checkUser.roles && checkUser.roles[0] == "admin"){
            let checkGroup = Group.findOne({_id:groupId});
    
            if(checkGroup){
                FeedbackRank.remove(
                {
                    "groupId": checkGroup._id
                });
                
                CardPlacement.remove(
                {
                    "groupId": checkGroup._id
                });

                CardChosen.remove(
                {
                    "groupId": checkGroup._id
                });
        
                GroupQuizData.remove(
                {
                    "groupId": checkGroup._id
                });

                Group.remove(
                    {
                        "_id": checkGroup._id
                    }
                )
            }else{
                throw (new Meteor.Error("group doesn't exist")); 
            }
        }else{
            throw (new Meteor.Error("unauthorized")); 
        }
        
    }
});

