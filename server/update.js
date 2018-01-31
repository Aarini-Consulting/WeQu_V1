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
                                                                   'services.invitationId': 'inviteProcessed',
                                                                   'profile.trial': false 
                                                                 } });
       },
       'updateProfileGroupQuizPerson' : function(userId, flag){
          return Meteor.users.update({_id: userId}, {$set: {'profile.groupQuizPerson' : flag } });
       },

        'signUpInvited' : function(data){

          Meteor.call("updateTrialUser", data.userId);

          Meteor.call('updateProfile', data);
    
          Meteor.call('setPassword', data.userId , data.registerPassword,  { logout: false });
    
          Meteor.call('verifiedTrue', data.userId);
        }
    });