Meteor.methods({
    'closeCycle' : function (groupId) {
      
        let groupCheck = Group.findOne({_id: groupId});
  
        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        let groupCreator = Meteor.users.findOne({_id:groupCheck.creatorId});
        
        if(!groupCheck){
            throw (new Meteor.Error("group_creator_missing")); 
        }


        var arr_emails=["yohandi@aarini.co"];
        
        for (var i = 0; i < arr_emails.length; i++) {

            var subject = `[WeQu] Notification for handling group cycle` ;

            var emailData = {
                'creatorEmail': groupCreator.emails[0].address,
                'creatorName' : (groupCreator.profile.firstName +" "+ groupCreator.profile.lastName) ,
                'groupId': groupCheck._id,
                'groupName': groupCheck.groupName
            };

            console.log(emailData);

            let body = SSR.render('GroupCloseCycleEmail', emailData);

            Meteor.call('sendEmail', arr_emails[i], subject, body, function (err, result) {
                if(err){ return err};
            });

        }
  
      return true;
  
    }
});
  
  