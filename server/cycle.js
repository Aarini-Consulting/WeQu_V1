Meteor.methods({
    'reopen.cycle' : function (groupId) {
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
        },
        { sort: { createdAt: -1 } });

        if(!latestCycle){
            throw (new Meteor.Error("no_previous_cycle_found")); 
        }

        if(latestCycle && !latestCycle.to){
            throw (new Meteor.Error("current_cycle_is_not_closed")); 
        }

        if(latestCycle && latestCycle.to && (now.getTime() - latestCycle.createdAt.getTime()) < (1 * 24 * 60 * 60 * 1000)){
            var groupUpdateId = FeedbackCycle.update(
                {_id: latestCycle._id} ,
                { $unset: {"to": ""}}
            ); 

            var arr_emails=["yohandi@aarini.co"];
        
        for (var i = 0; i < arr_emails.length; i++) {

            var subject = `[WeQ] Cancellation for handling group cycle` ;

            var emailData = {
                'creatorEmail': groupCreator.emails[0].address,
                'creatorName' : (groupCreator.profile.firstName +" "+ groupCreator.profile.lastName) ,
                'groupId': groupCheck._id,
                'groupName': groupCheck.groupName
            };
            
            var body;
            if(arr_emails[i] == groupCreator.emails[0].address){
                body = SSR.render('GroupCreatorCloseCycleCancelEmail', emailData);
            }else{
                body = SSR.render('GroupCloseCycleCancelEmail', emailData);
            }

            Meteor.call('sendEmail', arr_emails[i], subject, body, function (err, result) {
                if(err){ return err};
            });

        }
        }else{
            throw (new Meteor.Error("grace_period_is_over")); 
        }
    },
    'start.new.cycle' : function (groupId) {
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
        },
        { sort: { createdAt: -1 } });

        if(latestCycle && !latestCycle.to){
            throw (new Meteor.Error("cannot_start_new_cycle_without_closing_old_cycle")); 
        }

        if(latestCycle && latestCycle.to && (now.getTime() - latestCycle.createdAt.getTime()) < (2 * 24 * 60 * 60 * 1000)){
            throw (new Meteor.Error("cannot_start_new_cycle_yet")); 
        }else{
            FeedbackCycle.insert({
                'groupId': groupId, 
                'creatorId': Meteor.userId(), 
                'from': now
            });
        }
    },
    'close.cycle' : function (groupId) {
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

        if(!latestCycle){
            throw (new Meteor.Error("no_valid_cycle_found")); 
        }
        
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
                'to':user._id,
            });
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

        var fromDate = latestCycle.from || latestCycle.createdAt
        earliestFeedback = Feedback.findOne({
            done:true, groupId:groupCheck._id, 
            $and: [ {  'updatedAt':{"$lte":now} }, 
            {  'updatedAt':{"$gt":fromDate} } ]
        },
        { sort: { lastUpdated: 1 } });
        

        if(!earliestFeedback){
            throw (new Meteor.Error("no_completed_feedback_found")); 
        }

        FeedbackCycle.update({_id: latestCycle._id},
            {$set : { "to": now }});


        var arr_emails=["yohandi@aarini.co",groupCreator.emails[0].address];
        
        for (var i = 0; i < arr_emails.length; i++) {

            var subject = `[WeQ] Notification for handling group cycle` ;

            var emailData = {
                'creatorEmail': groupCreator.emails[0].address,
                'creatorName' : (groupCreator.profile.firstName +" "+ groupCreator.profile.lastName) ,
                'groupId': groupCheck._id,
                'groupName': groupCheck.groupName
            };
            var body;
            if(arr_emails[i] == groupCreator.emails[0].address){
                body = SSR.render('GroupCreatorCloseCycleEmail', emailData);
            }else{
                body = SSR.render('GroupCloseCycleEmail', emailData);
            }
            

            Meteor.call('sendEmail', arr_emails[i], subject, body, function (err, result) {
                if(err){ return err};
            });

        }
  
      return true;
    }
});
  
  