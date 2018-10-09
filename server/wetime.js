Meteor.methods({
    'update.msisdn' : function (msisdn) {
        if(this.userId){
            Meteor.users.update({_id: this.userId},
                {$set: {
                    'msisdn' : msisdn,
                } 
            });
        }
    },
    'send.verification.sms' : function (countryCode, phoneNumber) {
        if(this.userId){
            var result = HTTP.call( 'POST', 'https://api.authy.com/protected/json/phones/verification/start', 
            {
                data: {
                    api_key: 'ESDI1HGJzl9zRqIlTtQpJYNOLeOMPkWf',
                    via: 'sms',
                    phone_number: phoneNumber,
                    country_code: countryCode
                    }
            });

            return result;
        }else{
            throw new Meteor.Error("user undefined");
        }
    },
    'verify.number' : function (countryCode, phoneNumber, verificationCode) {
        if(this.userId){
            var result = HTTP.call( 'GET', 'https://api.authy.com/protected/json/phones/verification/check', 
            {
                params: {
                    api_key: 'ESDI1HGJzl9zRqIlTtQpJYNOLeOMPkWf',
                    verification_code: verificationCode,
                    phone_number: phoneNumber,
                    country_code: countryCode
                    }
            });
            if(result && result.data && result.data.success){
                Meteor.call('update.msisdn',phoneNumber);
            }

            return result;
        }else{
            throw new Meteor.Error("user undefined");
        }
    },
});