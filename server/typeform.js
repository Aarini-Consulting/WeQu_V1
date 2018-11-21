import { Meteor } from 'meteor/meteor';

Meteor.methods({
    //Creating a method to send verification.
    'get.access.token.typeform'(redirect_uri,auth_code) {
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

            return result;
        }
        catch(error){
            return error;
        }
        
    },
    'get.oauth.typeform'(redirect_uri) {
        this.unblock();
        console.log(Meteor.settings.private.TypeFormClientId);
        try {
            var result = HTTP.call( 'GET', 'https://api.typeform.com/oauth/authorize', 
            {
                params: {
                    "client_id": Meteor.settings.private.TypeFormClientId,
                    "redirect_uri":"http://localhost:3000/callback",
                    "scope":"responses:read"
                    }
            });
            
            console.log(result);
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    'get.response.typeform'(typeformId) {
        this.unblock();
        console.log(typeformId);
        try {
            var result = HTTP.call( 'GET', `https://api.typeform.com/forms/${typeformId}/responses`, 
            {
                headers: {
                    "Authorization":`Bearer ${Meteor.settings.private.TypeFormPersonalToken}`,
                }
                
            });
            
            console.log(result);
        } catch (error) {
            console.log(error);
            return error;
        }
    }
})