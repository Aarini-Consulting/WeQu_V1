Meteor.methods({
    'create.group.quiz'(component, question, answerOptions, rankItems, rankItemsLoadExternalField) {
        var newQuiz = {
            'component':component,
            'question': question,
        }

        if(rankItemsLoadExternalField){
            newQuiz.rankItemsLoadExternalField = rankItemsLoadExternalField
        }

        if(answerOptions){
            newQuiz.answerOptions = answerOptions;
        }

        if(rankItems){
            newQuiz.rankItems = rankItems;
        }

        GroupQuiz.insert(newQuiz);
    },
    'set.group.quiz'(groupId, groupQuizId) {
        var groupCheck = Group.findOne({_id:groupId,creatorId:this.userId});
        var groupQuizCheck = GroupQuiz.findOne({_id:groupQuizId});

        if(groupCheck){
            if(groupQuizCheck){
                Group.update({"_id":groupId},
                {'$set':{"isActive":true, "currentGroupQuizId":groupQuizId, "isPlaceCardActive":false}
                });
            }else{
                throw (new Meteor.Error("group_quiz_not_found")); 
            }   
        }else{
            throw (new Meteor.Error("group_not_found")); 
        }
    },

    'set.group.quiz.data'(groupId, groupQuizId, data) {
        // var groupCheck = Group.findOne({_id:groupId,creatorId:this.userId});
        var groupCheck = Group.findOne({_id:groupId});
        var groupQuizCheck = GroupQuiz.findOne({_id:groupQuizId});

        if(groupCheck){
            if(groupQuizCheck){
                GroupQuizData.upsert({"groupId":groupId,"groupQuizId":groupQuizCheck._id,"creatorId":this.userId},
                {
                    '$set':{"results":data}
                });
            }else{
                throw (new Meteor.Error("group_quiz_not_found")); 
            }   
        }else{
            throw (new Meteor.Error("group_not_found")); 
        }
    }
})
