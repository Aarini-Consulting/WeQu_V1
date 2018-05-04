Meteor.methods({
    'updateGroup' : function (group,groupName, data, emailsArray) {
        var groupId = group._id;
        let check = Group.findOne({_id:groupId});
        
        if(!check){
        throw (new Meteor.Error("group doesn't exist")); 
        }

        if(check.creatorId != Meteor.userId()){
            throw (new Meteor.Error("only owner can modify group")); 
        }

        var newEmailInGroup = emailsArray.filter((email)=>{
            return check.emails.indexOf(email) < 0
        })

        var newData = data.filter((d)=>{
            return check.emails.indexOf(d.email) < 0
        })

        Group.update({"_id":groupId},
        {'$set':{groupName: groupName,  emails:emailsArray , creatorId: group.creatorId}
        });	

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
            'firstName':emailTarget.profile.firstName,
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

