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
    'calculate.typeform.score'(groupId, typeformResponses) {
        console.log(typeformResponses.length);
        console.log(groupId);
        var checkGroup = Group.findOne({
            _id : groupId,
            creatorId: Meteor.userId()
        });

        var filteredByCurrentGroupName;

        if(checkGroup && typeformResponses.length > 0){
            filteredByCurrentGroupName = typeformResponses.filter((response) => {
                var responseGroupName;
                if(response.answers){
                    
                    var tempAnswer = response.answers.find((answer)=>{
                        return answer.field && answer.field.type == "short_text";
                    })

                    responseGroupName = tempAnswer.text;
                }

                if(responseGroupName){
                    responseGroupName = responseGroupName.toString().trim().toLowerCase();
                    return responseGroupName == checkGroup.groupName.toString().trim().toLowerCase();
                }else{
                    return false;
                }
            });

            console.log(filteredByCurrentGroupName.length);
        }else{

        }
        
          
    },
    'get.all.response.typeform'(groupId, typeformId,since=new Date()) {
        var pageSize = 25;
        var dateNow = new Date();
        var endResult;
        var result = Meteor.call('get.response.typeform', pageSize, typeformId, false, since, dateNow);

        if(result && result.data){
            endResult = result.data.items;
            var pageCount = result.data.page_count;
            if(pageCount > 1){
                var lastResult = result.data.items && result.data.items.length > 0 && result.data.items[result.data.items.length-1];
                for(var i = 0; i < pageCount; i++) {
                    var tempResult;
                    if(lastResult){
                        tempResult = Meteor.call('get.response.typeform', pageSize, typeformId, lastResult.token, since, dateNow);
                        lastResult = tempResult.data.items && tempResult.data.items.length > 0 && tempResult.data.items[tempResult.data.items.length-1];
                    }
                    

                    if(tempResult && tempResult.data && tempResult.data.items && tempResult.data.items.length > 0){
                        endResult = endResult.concat(tempResult.data.items);
                        tempResult = false;
                    }
                }
            }   
        }

        Meteor.call('calculate.typeform.score', groupId, endResult);

        return endResult;
    },
    'get.response.typeform'(pageSize, typeformId,afterTokenValue,since=new Date(), until=new Date()) {
        this.unblock();

        if(since){
            since = since.toISOString();
        }

        if(until){
            until = until.toISOString();
        }

        try {
            var params = {
                "since": since,
                "until": until,
                "completed": true,
                "page_size": pageSize,
                "sort": "submitted_at,asc"
            }

            if(afterTokenValue){
                params.after = afterTokenValue;
            }

            var result = HTTP.call( 'GET', `https://api.typeform.com/forms/${typeformId}/responses`, 
            {
                headers: {
                    "Authorization":`Bearer ${Meteor.settings.private.TypeFormPersonalToken}`,
                },
                params: params
            });
            
            return result;
        } catch (error) {
            return error;
        }
    }
})