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

        Group.update({"_id":groupId},
        {'$set':{groupName: groupName , data:data,  emails:emailsArray , creatorId: group.creatorId}
        });	
        
        var arr_emails_existing = []; 
        var arr_emails_notExisting = [];

        emailsArray.filter(typeOfUser); // Filtering existing members
            function typeOfUser(email){
            user = Meteor.users.findOne({$or : [ {"emails.address" : email  }, { "profile.emailAddress" : email }]} );
            if (user) {
                arr_emails_existing.push(email);
            }
            else{
                arr_emails_notExisting.push(email)
            }
            };

        Meteor.call('genGroupQuestionSet', emailsArray , groupId , data, groupName, (err, result)=> {
            //  console.log("genGroupQuestionSet" , err, result);
                if(err){ return err}
                else{
                var link; 
                for (var i = 0; i < arr_emails_notExisting.length; i++) {
        
                    link = `group-invitation/${arr_emails_notExisting[i]}/${groupId}`
                
                    var subject = `[WeQ] Invitation to join the group "${groupName}"` ;
                    var message = `Please join the group by clicking the invitation link ${link}`
                
                    var emailData = {
                    'from': '',
                    'to' : '',
                    'link': Meteor.absoluteUrl(link),
                    'groupName': groupName
                    };
                
                    let body = SSR.render('GroupInviteHtmlEmail', emailData);
                
                    Meteor.call('sendEmail', arr_emails_notExisting[i], subject, body, function (err, result) {
                    if(err){ return err}
                    });
                
                }
                }
            });
        
        return arr_emails_notExisting.length;

    },
    'resend.group.invite' : function (groupId,email) {
        let check = Group.findOne({_id:groupId,emails:email});
        console.log(check);
        if(check){
            var link = `group-invitation/${email}/${groupId}`
                
            var subject = `[WeQ] Invitation to join the group "${check.groupName}"` ;
            var message = `Please join the group by clicking the invitation link ${link}`
        
            var emailData = {
            'from': '',
            'to' : '',
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

