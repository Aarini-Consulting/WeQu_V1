  Meteor.methods({
        'updateTrialUser' : function (data) {
            console.log(data);
            Meteor.users.update({_id : data }, {$set : { "profile.trialMember" : false }});

            let t = Connections.findOne({ userId: data });
            console.log(t);
            if(t){
              return Connections.update({_id: t._id }, {$set : { "profile.trialMember" : false }});    
            }
            return false;
            
        },
        'updateProfile' : function (data) {
           return Meteor.users.update({_id: data.userId}, {$set: {'profile.firstName' : data.firstName , 'profile.lastName' : data.lastName } });
       } 
    });