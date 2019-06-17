import {Group} from '/collections/group';
import {GroupQuiz} from '/collections/groupQuiz';
import {GroupQuizData} from '/collections/groupQuizData';

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
                //if place card mode is not finished, call the "stop" function to remove all data about it as well
                if(!groupCheck.isPlaceCardFinished){
                    Meteor.call('stop.game.place.cards', groupId);
                }

                //check if play card mode is ever used
                if(groupCheck.playCardTypeActive){
                    Meteor.call('stop.game.play.cards', groupId,groupCheck.playCardTypeActive);
                }

                Group.update({"_id":groupId},
                {
                    '$set':{"isActive":true, "currentGroupQuizId":groupQuizId, "isPlaceCardActive":false}
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
