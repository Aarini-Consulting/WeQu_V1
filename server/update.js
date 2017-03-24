  Meteor.methods({
        'updateTrialUser' : function (userId) {
            console.log(userId);
            if(!userId){
              throw (new Meteor.Error("empty_userId"));
            }
            Meteor.users.update({_id : userId }, {$set : { "profile.trialMember" : false }});
            let t = Connections.findOne({ userId: userId });
            console.log(t);
            if(t){
              return Connections.update({_id: t._id }, {$set : { "profile.trialMember" : false }});    
            }
            return false;
        },
        'updateProfile' : function (data) {
           return Meteor.users.update({_id: data.userId}, {$set: {'profile.firstName' : data.firstName ,
                                                                  'profile.lastName' : data.lastName , 
                                                                   'services.invitationId': 'inviteProcessed' 
                                                                 } });
       }/*,
       'updateServices' : function(data){
          console.log(data);
          const {userId, services } = data;
          return Meteor.users.update({_id: data.userId}, {$set: {'services.linkedin' : services.linkedin } });
       } */
    });