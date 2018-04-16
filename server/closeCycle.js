Meteor.methods({
    'closeCycle' : function (groupId) {
        var now = new Date();

        let groupCheck = Group.findOne({'_id': groupId});
  
        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        let groupCreator = Meteor.users.findOne({'_id':groupCheck.creatorId});
        
        if(!groupCheck){
            throw (new Meteor.Error("group_creator_missing")); 
        }

        var latestCycle = FeedbackCycle.findOne({
            'groupId':groupCheck._id,
            'creatorId': groupCreator._id,
            'to': {$exists: false}
        },
        { sort: { createdAt: -1 } });

        var earliestFeedback;
        var personalFeedback=[];
        var othersFeedback=[];
        var users = Meteor.users.find({$or : [ 
            {"emails.address" : {$in:groupCheck.emails}  }, 
            { "profile.emailAddress" : {$in:groupCheck.emails}}
        ]}).fetch();

        users.forEach(user => {
            var fbOthers;
            var fbOwn = Feedback.findOne({
                'done':true,
                'from':user._id,
                'to':user._id
            });
            if(latestCycle){
                var fromDate = latestCycle.from || latestCycle.createdAt
                fbOthers = Feedback.findOne({
                    'done':true,
                    'groupId':groupCheck._id,
                    'from': { '$ne': user._id },
                    'to':user._id,
                    "$and": [ 
                        {  'updatedAt':{"$lte":now} }, 
                        {  'updatedAt':{"$gt":fromDate} } 
                    ]
                });
            }else{
                fbOthers = Feedback.findOne({
                    'done':true,
                    'groupId':groupCheck._id,
                    'from': { '$ne': user._id },
                    'to':user._id,
                    'updatedAt':{"$lte":now}
                });
            }
            

            if(fbOwn){
                personalFeedback.push(fbOwn);
            }

            if(fbOthers){
                othersFeedback.push(fbOthers);
            }
        });

        if(personalFeedback.length < groupCheck.emails.length){
            throw (new Meteor.Error("not_everyone_finished_own_quiz")); 
        }

        if(othersFeedback.length < groupCheck.emails.length){
            throw (new Meteor.Error("not_everyone_receive_feedback")); 
        }

        if(latestCycle){
            var fromDate = latestCycle.from || latestCycle.createdAt
            earliestFeedback = Feedback.findOne({
                done:true, groupId:groupCheck._id, 
                $and: [ {  'updatedAt':{"$lte":now} }, 
                {  'updatedAt':{"$gt":fromDate} } ]
            },
            { sort: { lastUpdated: 1 } });
        }else{
            earliestFeedback = Feedback.findOne({
                'done':true, 'groupId':groupCheck._id, 
                'updatedAt':{"$lte":now}
            },
            { sort: { lastUpdated: 1 } });
        }

        if(!earliestFeedback){
            throw (new Meteor.Error("no_completed_feedback_found")); 
        }

        if(latestCycle){
            FeedbackCycle.update({_id: latestCycle._id},
                {$set : { "to": now }});
        }else{
            fcId = FeedbackCycle.insert({
                'groupId': groupCheck._id, 
                'creatorId': groupCreator._id, 
                'from': earliestFeedback.updatedAt,
                'to': now
            });
        }

        var arr_emails=["yohandi@aarini.co"];
        
        for (var i = 0; i < arr_emails.length; i++) {

            var subject = `[WeQ] Notification for handling group cycle` ;

            var emailData = {
                'creatorEmail': groupCreator.emails[0].address,
                'creatorName' : (groupCreator.profile.firstName +" "+ groupCreator.profile.lastName) ,
                'groupId': groupCheck._id,
                'groupName': groupCheck.groupName
            };

            let body = SSR.render('GroupCloseCycleEmail', emailData);

            Meteor.call('sendEmail', arr_emails[i], subject, body, function (err, result) {
                if(err){ return err};
            });

        }
  
      return true;
  
    }
});
  
  