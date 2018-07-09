Meteor.methods({
    'updateGroup' : function (group,groupName, data, emailsArray) {
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

        var newEmailInGroup = emailsArray.filter((email)=>{
            return groupCheck.emails.indexOf(email) < 0
        })

        var newData = data.filter((d)=>{
            return groupCheck.emails.indexOf(d.email) < 0
        })

        var removedEmails = groupCheck.emails.filter((email)=>{
            return emailsArray.indexOf(email) < 0
        })
        var updatedEmailsSurveyed;
        if(removedEmails && removedEmails.length > 0 && groupCheck.emailsSurveyed){
            updatedEmailsSurveyed = groupCheck.emailsSurveyed.filter((email)=>{
                return removedEmails.indexOf(email) < 0
            })
        }

        var updatedEmailsSelfRankCompleted;
        if(removedEmails && removedEmails.length > 0 && groupCheck.emailsSelfRankCompleted){
            updatedEmailsSelfRankCompleted = groupCheck.emailsSelfRankCompleted.filter((email)=>{
                return removedEmails.indexOf(email) < 0
            })
        }
        

        if(removedEmails.length > 0){
            var users = Meteor.users.find(
                {"emails.0.address":{$in:removedEmails}}
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
        {'$set':{groupName: groupName,  emails:emailsArray , creatorId: group.creatorId}
        });

        if(updatedEmailsSurveyed){
            Group.update({"_id":groupId},
            {'$set':{emailsSurveyed: updatedEmailsSurveyed}
            });	
        }

        if(updatedEmailsSelfRankCompleted){
            Group.update({"_id":groupId},
            {'$set':{emailsSelfRankCompleted: updatedEmailsSelfRankCompleted}
            });	
        }

        Meteor.call('genGroupQuestionSet', newEmailInGroup , groupId , newData, groupName, (err, result)=> {
            //  console.log("genGroupQuestionSet" , err, result);
                if(err){ return err}
            });
        
        return newEmailInGroup.length;

    },
    'resend.group.invite' : function (groupId,email) {
        let check = Group.findOne({_id:groupId});
    
        if(check){
            let groupCreator = Meteor.users.findOne({'_id':check.creatorId});
            
            if(!check){
                throw (new Meteor.Error("group_creator_missing")); 
            }

            if(check.emails.indexOf(email) < 0){
                throw (new Meteor.Error("email_not_group_member")); 
            }

            var emailTarget = Meteor.users.findOne({'emails.0.address': email});

            if(!emailTarget){
                throw (new Meteor.Error("user_not_found")); 
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
        
            Meteor.call('sendEmail', email, subject, body);

            return true;

        }else{
            throw (new Meteor.Error("group doesn't exist")); 
        }

        return false;
    }
});

