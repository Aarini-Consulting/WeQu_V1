  Meteor.methods({
        'updateProfileFromTrial' : function (data) {
           return Meteor.users.update({_id: data.userId}, {$set: {'profile.firstName' : data.firstName ,
                                                                  'profile.lastName' : data.lastName ,
                                                                  'profile.trial': false,
                                                                  'profile.consentSubs':{consentGiven:data.consentSubs, lastUpdated:new Date()}
                                                                 } });
       },
       'updateConsent' : function (consent) {
        return Meteor.users.update({_id: Meteor.userId()}, {$set: {
                                                               'profile.consentSubs':{consentGiven:consent, lastUpdated:new Date()}
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