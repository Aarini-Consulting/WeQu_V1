Meteor.methods({
    'update.selected.group' : function (groupId) {
        if(this.userId){
            Meteor.users.update({_id: this.userId},
                {$set: {
                    'lastSelectedGroupId' : groupId,
                } 
            });
        }
    },
    'update.mobile' : function (countryCode, msisdn) {
        if(this.userId){
            Meteor.users.update({_id: this.userId},
                {$set: {
                    'mobile' : [{'countryCode':countryCode, 'number':msisdn, 'verified':true}],
                } 
            });
        }
    },
    'send.verification.sms' : function (countryCode, phoneNumber) {
        if(this.userId){
            try{
                HTTP.call( 'POST', 'https://api.authy.com/protected/json/phones/verification/start', 
                {
                    data: {
                        api_key: Meteor.settings.private.twillioVerificationApiKey,
                        via: 'sms',
                        phone_number: phoneNumber,
                        country_code: countryCode
                        }
                });
                return true;
            }
            catch(e){
                console.log(e);
                return false;
            }

        }else{
            throw new Meteor.Error("user undefined");
        }
    },
    'verify.number' : function (countryCode, phoneNumber, verificationCode) {
        if(this.userId){
            try{
                var result = HTTP.call( 'GET', 'https://api.authy.com/protected/json/phones/verification/check', 
                {
                    params: {
                        api_key: Meteor.settings.private.twillioVerificationApiKey,
                        verification_code: verificationCode,
                        phone_number: phoneNumber,
                        country_code: countryCode
                        }
                });
                if(result && result.data && result.data.success){
                    Meteor.call('update.mobile',countryCode, phoneNumber);
                }
                return true;
            }
            catch(e){
                console.log(e);
                return false;
            }

        }else{
            throw new Meteor.Error("user undefined");
        }
    },
    'send.sms.invitation' : function (msisdn, link) {
        if(this.userId){
            check(link, String);
            if(link.startsWith('https://wetime.page.link/')){
                var message=`Oh boy, looks like somebody wants you to join WeTime:${link}`
                try{
                    HTTP.call( 'POST', `https://api.twilio.com/2010-04-01/Accounts/${Meteor.settings.private.twillioNotificationAccountSid}/Messages.json`, 
                    {
                        params: {
                            To: msisdn,
                            From: Meteor.settings.private.twillioNotificationSenderMsisdn,
                            Body: message,
                        },
                        auth:`${Meteor.settings.private.twillioNotificationAccountSid}:${Meteor.settings.private.twillioNotificationAuthKey}`
                    });
                    return true;
                }
                catch(e){
                    console.log(e);
                    return false;
                }
            }else{
                throw new Meteor.Error("malformed link");
            }
        }else{
            throw new Meteor.Error("user undefined");
        }
    },
});