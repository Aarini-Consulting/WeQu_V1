import {sendEmail} from '../emailNotifications';
import {Group} from '/collections/group';

Meteor.methods({
    'survey.typeform.completed' : function (groupId,userId) {
        let check = Group.findOne({_id:groupId});

        if(check){
            var userIdsSurveyed = [];

            if(check.userIdsSurveyed){
                userIdsSurveyed = check.userIdsSurveyed;
            }

            if(userIdsSurveyed.indexOf(userId) < 0){
                userIdsSurveyed.push(userId);
            }

            Group.update({"_id":groupId},
                {'$set':{userIdsSurveyed:userIdsSurveyed}
            });

            Meteor.users.update({
                "$and": [ 
                    {  '_id':this.userId }, 
                    {  'profile.selfRank': groupId} 
                ]}, 
                {$unset : { "profile.selfRank": "" }});
            
            var updatedGroup =  Group.findOne(groupId);
            var usersSurveyIncomplete = Meteor.users.find(
                {$and : [ {"_id" : {$in:updatedGroup.userIds} }, {"_id" : {$nin:updatedGroup.userIdsSurveyed} }]}
            ).fetch();

            if(usersSurveyIncomplete.length < 1){
                var groupCreator = Meteor.users.findOne(updatedGroup.creatorId);
                var subject = `[WeQ] Group Survey Completed`;

                var emailData = {
                    'creatorEmail': groupCreator.emails[0].address,
                    'creatorName' : (groupCreator.profile.firstName +" "+ groupCreator.profile.lastName) ,
                    'groupId': updatedGroup._id,
                    'groupName': updatedGroup.groupName
                };
                var body = SSR.render('GroupSurveyCompletedEmail', emailData);

                sendEmail("contact@weq.io", subject, body)

                var emailDataCmc = {
                    'creatorEmail': groupCreator.emails[0].address,
                    'creatorName' : (groupCreator.profile.firstName) ,
                    'groupId': updatedGroup._id,
                    'groupName': updatedGroup.groupName,
                    'appLink':Meteor.absoluteUrl()
                };
                var bodyCmc = SSR.render('GroupSurveyCompletedEmailCmc', emailDataCmc);

                sendEmail(groupCreator.emails[0].address, subject, bodyCmc);
            }
            
                
        }else{
            throw (new Meteor.Error("group_not_found")); 
        }
    },
    'set.typeform.graph' : function (groupId,graphData) {
        let check = Group.findOne({_id:groupId});
        if(check){
            Group.update({"_id":groupId},
                {'$set':{typeformGraph:graphData}
            });
        }else{
            throw (new Meteor.Error("group_not_found")); 
        }
    }
});
  
  