import { Meteor } from 'meteor/meteor';

function getCategoryScoreFromString(scoreAsString){
    var score = Number(scoreAsString);

    if(score < 3){
        score = 3;
    }

    if(score > 24){
        score = 24;
    }

    return score/3;

}

function averageCategoryScore(score, count){
    if(score < 1){
        return 0;
    }else{
        return score/count;
    }
}

Meteor.methods({
    'calculate.typeform.score'(groupId, typeformResponses) {
        var checkGroup = Group.findOne({
            _id : groupId,
            creatorId: Meteor.userId()
        });

        var scoreCostructiveFeedback = 0;
        var scorePsychologicalSafety = 0;
        var scoreSocialNorms = 0;
        var scoreControlOverCognitiveBias = 0;
        var validAnswerCount = 0;

        if(checkGroup && typeformResponses.length > 0){
            typeformResponses.filter((response) => {
                //make sure response has a calculated score of 8 digit number
                var scoreAsString = response.calculated && response.calculated.score && response.calculated.score.toString();
                
                if(scoreAsString && scoreAsString.length == 7){
                    scoreAsString = "0" + scoreAsString;
                }

                if(scoreAsString.length == 8){
                    var responseGroupName;
                    if(response.answers){
                        
                        var tempAnswer = response.answers.find((answer)=>{
                            return answer.field && answer.field.type == "short_text";
                        })

                        responseGroupName = tempAnswer.text;
                    }

                    if(responseGroupName){
                        responseGroupName = responseGroupName.toString().trim().toLowerCase();

                        if(responseGroupName == checkGroup.groupName.toString().trim().toLowerCase()){
                            validAnswerCount+=1;

                            scoreControlOverCognitiveBias += getCategoryScoreFromString(scoreAsString.substr(0, 2));
                            scoreSocialNorms += getCategoryScoreFromString(scoreAsString.substr(2, 2));
                            scorePsychologicalSafety += getCategoryScoreFromString(scoreAsString.substr(4, 2));
                            scoreCostructiveFeedback += getCategoryScoreFromString(scoreAsString.substr(6, 2));
                        }
                    }
                }
            });

            var typeformGraph = [
                {
                    name:"Constructive Feedback",
                    score:averageCategoryScore(scoreCostructiveFeedback,validAnswerCount), 
                    total:8
                },
                {
                    name:"Psychological Safety",
                    score:averageCategoryScore(scorePsychologicalSafety,validAnswerCount), 
                    total:8
                },
                {
                    name:"Social Norms",
                    score:averageCategoryScore(scoreSocialNorms,validAnswerCount), 
                    total:8
                },
                {
                    name:"Control over Cognitive Bias",
                    score:averageCategoryScore(scoreControlOverCognitiveBias,validAnswerCount), 
                    total:8
                },
            ]
    
            Meteor.call( 'set.typeform.graph', checkGroup._id, typeformGraph);

            return true;
        }
    },
    'get.all.response.typeform'(groupId, typeformIds,since=new Date()) {
        var checkGroup = Group.findOne({
            _id : groupId,
            creatorId: Meteor.userId()
        });

        if(!checkGroup){
            throw (new Meteor.Error("group_not_found")); 
        }

        if(!(checkGroup.userIds && checkGroup.userIdsSurveyed && checkGroup.userIds.length == checkGroup.userIdsSurveyed.length)){
            throw (new Meteor.Error("not_all_finished_survey")); 
        }

        var pageSize = 25;
        var dateNow = new Date();
        
        var endResultCombined = [];
        typeformIds.forEach((typeformId)=>{
            var endResult=[];
            var result = Meteor.call('get.response.typeform', pageSize, typeformId, false, since, dateNow);

            if(result && result.data){
                endResult = result.data.items;
                var pageCount = result.data.page_count;

                //get the rest of the result in other pages
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
            if(Array.isArray(endResult)){
                endResultCombined = endResultCombined.concat(endResult);
            }
        });

        Meteor.call('calculate.typeform.score', groupId, endResultCombined);

        return true;
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