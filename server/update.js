  Meteor.methods({
        'updateProfileFromTrial' : function (data) {
           return Meteor.users.update({_id: data.userId}, {$set: {'profile.firstName' : data.firstName ,
                                                                  'profile.lastName' : data.lastName , 
                                                                   'services.invitationId': 'inviteProcessed',
                                                                   'profile.trial': false 
                                                                 } });
       },
      //  'updateProfileGroupQuizPerson' : function(userId, flag){
      //     return Meteor.users.update({_id: userId}, {$set: {'profile.groupQuizPerson' : flag } });
      //  },

        'signUpInvited' : function(data){

          Meteor.call('updateProfileFromTrial', data);
    
          Meteor.call('setPassword', data.userId , data.registerPassword,  { logout: false });
    
          Meteor.call('verifiedTrue', data.userId);
        }
    });