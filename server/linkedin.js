import { Meteor } from 'meteor/meteor';

Meteor.methods({
    //Creating a method to send verification.
    'get.access.token'(redirect_uri,auth_code) {
        this.unblock();
        try{
            var result = HTTP.call( 'POST', 'https://www.linkedin.com/oauth/v2/accessToken', 
            {
                params: {
                "grant_type": "authorization_code",
                "code":auth_code,
                "redirect_uri":redirect_uri,
                "client_id":Meteor.settings.private.LinkedInClientId,
                "client_secret":Meteor.settings.private.LinkedInSecretId
                }
            });
            console.log(result);
            return result;
        }
        catch(error){
            return error;
        }
        
    },
    'get.linkedIn.data'(accessToken, extraFields) {
        // remove the whitespaces which could break the request
        var extraFields = extraFields.replace(/\s+/g, '')

        this.unblock();

        try {
            var result = HTTP.call( 'GET', 'https://api.linkedin.com/v1/people/~:(' + extraFields + ')?format=json&format=json-get', 
            {
                params: {
                    oauth2_access_token: accessToken,
                    format: 'json'
                    }
            });
            console.log(result);
            if(result.data){
                Meteor.call('store.linkedIn.data', result.data);
                return true;
            }
            return false;
        } catch (error) {
            return error;
        }
    },
    'store.linkedIn.data'(linkedInData) {
        Meteor.users.update(Meteor.userId(), { 
            '$set': { 
                'profile.linkedIn': linkedInData,
                } 
            });
    },

})