import { Meteor } from 'meteor/meteor';

Meteor.methods({
    //Creating a method to send verification.
    'get.access.token'(redirect_uri,auth_code) {
        return HTTP.call( 'POST', 'https://www.linkedin.com/oauth/v2/accessToken', 
        {
            params: {
            "grant_type": "authorization_code",
            "code":auth_code,
            "redirect_uri":redirect_uri,
            "client_id":Meteor.settings.private.LinkedInClientId,
            "client_secret":Meteor.settings.private.LinkedInSecretId
            }
        },
        ( error, response ) => {
            // Handle the error or response here.
            if(error){
                console.log(error);
                throw new Meteor.Error("error with linkedin");
            }else{
                console.log(response);
                return response;
            }
        });
    },
    'get.linkedIn.data'(accessToken, extraFields) {
        // remove the whitespaces which could break the request
        extraFields = extraFields.replace(/\s+/g, '')

        HTTP.call( 'GET', 'https://api.linkedin.com/v1/people/~:(' + extraFields + ')', 
        {
            params: {
                oauth2_access_token: accessToken,
                format: 'json'
                }
        },
        ( error, response ) => {
            // Handle the error or response here.
            if(error){
                console.log(error);
                throw new Meteor.Error("error with linkedin");
            }else{
                console.log(response);
                return response;
            }
        });
      },

})