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
  
  