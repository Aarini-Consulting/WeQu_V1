Meteor.methods({
    'updateGroup' : function (group,groupName, data, arr_emails) {
        var groupId = group._id;
        let groupCheck = Group.findOne({_id:groupId});
        
        if(!groupCheck){
        throw (new Meteor.Error("group doesn't exist")); 
        }

        if(groupCheck.creatorId != Meteor.userId()){
            throw (new Meteor.Error("only owner can modify group")); 
        }

        var gmCheck = Roles.userIsInRole( Meteor.userId(), 'GameMaster' );

        if(!gmCheck){
        throw (new Meteor.Error("only_gamemaster_can_create_group")); 
        }


        //create user in db as necessary
        Meteor.call('genGroupUserUpFront',  arr_emails, undefined, data, function (err, result) {
            // console.log("genGroupUserUpFront" , err, result);
            if(err){ return err};
        });

        //get users from email
        var users = Meteor.users.find({$or : [ {"emails.address" : {$in:arr_emails}}, { "profile.emailAddress" : {$in:arr_emails} }]}).fetch();
        var userIds = users.map( (user) => user._id);

        var newUserInGroup = userIds.filter((uid)=>{
            return groupCheck.userIds.indexOf(uid) < 0
        })

        //create new user's self rank feedback
        newUserInGroup.forEach(function(user, index, _arr) {
            Meteor.call( 'generate.self.rank', user, groupCheck._id, (error, result)=>{
            if(error){
                console.log(error);
            }
            });
        });

        var removedUsers = groupCheck.userIds.filter((uid)=>{
            return userIds.indexOf(uid) < 0
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
        {'$set':{groupName: groupName,  userIds:userIds , creatorId: group.creatorId}
        });

        if(updatedUserIdsSurveyed){
            Group.update({"_id":groupId},
            {'$set':{userIdsSurveyed: updatedUserIdsSurveyed}
            });	
        }

        if(updatedUserIdsSelfRankCompleted){
            Group.update({"_id":groupId},
            {'$set':{userIdsSelfRankCompleted: updatedUserIdsSelfRankCompleted}
            });	
        }

        // Meteor.call('genGroupQuestionSet', newEmailInGroup , groupId , newData, groupName, (err, result)=> {
        //     //  console.log("genGroupQuestionSet" , err, result);
        //         if(err){ return err}
        //     });
        
        return newUserInGroup.length;

    },
    'resend.group.invite' : function (groupId,email) {
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

           
            
            var link = `group-invitation/${email}/${groupId}`
                
            var subject = `[WeQ] Invitation to join the group "${check.groupName}"` ;
            var message = `Please join the group by clicking the invitation link ${link}`
        
            var emailData = {
            'creatorEmail': groupCreator.emails[0].address,
            'link': Meteor.absoluteUrl(link),
            'groupName': check.groupName
            };
        
            let body = SSR.render('GroupInviteHtmlEmail', emailData);

            // Meteor.call('send.notification', (error, result) => {
            //     console.log(error);
            //     console.log(result);
            // });
        
            Meteor.call('sendEmail', email, subject, body);

            return true;

        }else{
            throw (new Meteor.Error("group doesn't exist")); 
        }

        return false;
    }
});

