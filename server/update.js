  Meteor.methods({
        'updateProfileFromTrial' : function (data) {
          //check if user is invited from sms
          var checkUser = Meteor.users.findOne({_id:data.userId});
          if(checkUser && checkUser.mobile && checkUser.mobile.length > 0 && checkUser.mobile[0].number){
            if(!checkUser.emails){
              //add new email
              Accounts.addEmail(checkUser._id, data.registerEmail);
            }
            
            Meteor.users.update({_id: checkUser._id},
              {$set: {
                'mobile.0.verified':true,
              } 
            });
          }

          return Meteor.users.update({_id: data.userId}, {$set: {'profile.firstName' : data.firstName ,
                                                                  'profile.lastName' : data.lastName ,
                                                                  'profile.trial': false,
                                                                  'profile.consentSubs':{consentGiven:data.consentSubs, lastUpdated:new Date()}
                                                                 } });
       },
       'updateConsent' : function (consent) {
        return Meteor.users.update({_id: this.userId}, {$set: {
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