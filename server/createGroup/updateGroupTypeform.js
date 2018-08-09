Meteor.methods({
    'survey.typeform.completed' : function (groupId,email) {
        let check = Group.findOne({_id:groupId});

        if(check){
            var emailsSurveyed = [];

            if(check.emailsSurveyed){
                emailsSurveyed = check.emailsSurveyed;
            }

            if(emailsSurveyed.indexOf(email) < 0){
                emailsSurveyed.push(email);
            }

            Group.update({"_id":groupId},
                {'$set':{emailsSurveyed:emailsSurveyed}
            });

            Meteor.users.update({
                "$and": [ 
                    {  '_id':Meteor.userId() }, 
                    {  'profile.selfRank': groupId} 
                ]}, 
                {$unset : { "profile.selfRank": "" }});
            
            var updatedGroup =  Group.findOne(groupId);
            var usersSurveyIncomplete = Meteor.users.find(
                {$and : [ {"emails.address" : {$in:updatedGroup.emails} }, {"emails.address" : {$nin:updatedGroup.emailsSurveyed} }]}
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
                var body;
                body = SSR.render('GroupSurveyCompletedEmail', emailData);

                Meteor.call('sendEmail', "contact@weq.io", subject, body);
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
  
  