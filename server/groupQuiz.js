Meteor.methods({
    'create.group.quiz'(component, question, answerOptions, rankItems) {
        var newQuiz = {
            'component':component,
            'question': question,
        }

        if(answerOptions){
            newQuiz.answerOptions = answerOptions;
        }

        if(rankItems){
            newQuiz.rankItems = rankItems;
        }
        FeedbackCycle.insert(newQuiz);
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
    }
})
