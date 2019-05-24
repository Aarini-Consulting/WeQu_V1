import {Group} from '/collections/group';
import {FeedbackRank} from '/collections/feedbackRank';
import {CardPlacement} from '/collections/cardPlacement';
import { PlayCard } from '/collections/playCard';

export function generateCardsToChoose(userId, groupId, playCardType) {
    let groupCheck = Group.findOne({'_id': groupId});

    if(!groupCheck){
        throw (new Meteor.Error("unknown_group")); 
    }
    
    var playCardSelfCheck = PlayCard.findOne({'groupId': groupId,'from': userId,'to': userId,'playCardType':playCardType});
    if(!playCardSelfCheck){
        var cardPlacementCheck = CardPlacement.findOne({'groupId': groupId,'userId': userId});

        if(cardPlacementCheck && cardPlacementCheck.cardPicked && cardPlacementCheck.cardPicked.length == 7){
            let cardsToChoose=[];
            if(playCardType == "praise"){
                cardsToChoose = [cardPlacementCheck.cardPicked[2],cardPlacementCheck.cardPicked[3]];
            }else if(playCardType == "criticism"){
                cardsToChoose = [cardPlacementCheck.cardPicked[4],cardPlacementCheck.cardPicked[5],cardPlacementCheck.cardPicked[6]];
            }
            //choose card for themselves
            PlayCard.upsert({
                'from': userId,
                'to': userId,
                'playCardType': playCardType,
                'groupId': groupCheck._id,
                
            },
            {$set: {
                'cardsToChoose': cardsToChoose
                }
            });


             //get other members in the group
            var users = Meteor.users.find({
                $and : [{"_id":{$ne:userId}}, 
                {"_id":{$in:groupCheck.userIds}}],
            },
            {sort: { "profile.firstName": 1 }}
            ).fetch();

            if(users.length < 1){
                throw new Meteor.Error("no_group_member_found");
            }

            for(var i=0;i<users.length;i++){
                let targetUserId = users[i] && users[i]._id;
                var cardPlacementCheckOther = CardPlacement.findOne({'groupId': groupId,'userId':targetUserId});
                if(cardPlacementCheckOther && cardPlacementCheckOther.cardPicked && cardPlacementCheckOther.cardPicked.length == 7){
                    var playCardOtherCheck = PlayCard.findOne({'groupId': groupId,'from': userId,'to': targetUserId,'playCardType':playCardType});
                    if(!playCardOtherCheck){
                        //choose card for others
                        let cardsToChoose=[];
                        if(playCardType == "praise"){
                            cardsToChoose = [cardPlacementCheckOther.cardPicked[2],cardPlacementCheckOther.cardPicked[3]];
                        }else if(playCardType == "criticism"){
                            cardsToChoose = [cardPlacementCheckOther.cardPicked[4],cardPlacementCheckOther.cardPicked[5],cardPlacementCheckOther.cardPicked[6]];
                        }

                        PlayCard.upsert({
                            'from': userId,
                            'to': targetUserId,
                            'playCardType': playCardType,
                            'groupId': groupCheck._id,
                            
                        },
                        {$set: {
                            'cardsToChoose': cardsToChoose,
                            }
                        });
                    }
                }else{
                    throw (new Meteor.Error("card_picked_number_invalid")); 
                }
            }
        }else{
            throw (new Meteor.Error("card_picked_number_invalid")); 
        }
    }
}

Meteor.methods({
    'start.game.play.cards': function(groupId, playCardType) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        if(!playCardType || (playCardType != "praise" && playCardType != "criticism")){
            throw (new Meteor.Error("unknown_type_mode")); 
        }

        if(groupCheck && groupCheck.userIds && groupCheck.userIds.length < 2){
            throw (new Meteor.Error("not_enough_group_member")); 
        }

        if(groupCheck && groupCheck.userIds && groupCheck.userIds.length > 12){
            throw (new Meteor.Error("too_much_group_member")); 
        }

        if(!(groupCheck && groupCheck.playCardTypeList && groupCheck.playCardTypeList.length > 0)){
            throw (new Meteor.Error("group_not_set_to_play_card")); 
        }

        if(!(groupCheck && groupCheck.playCardTypeList && groupCheck.playCardTypeList.indexOf(playCardType) > -1)){
            throw (new Meteor.Error("type_not_assigned_to_this_group")); 
        }

        var cardPlacementCheck = CardPlacement.find({'groupId': groupId}).fetch();

        
        var cardNotPicked = cardPlacementCheck.find((cp) => {
            return !(cp.cardPicked && cp.cardPicked.length == 7);
        });

        if(cardNotPicked){
            throw (new Meteor.Error("not_everyone_finished_picking_card")); 
        }

        if(!groupCheck.isFinished){
            if(groupCheck.userIdsSurveyed && groupCheck.userIdsSurveyed.length == groupCheck.userIds.length){
                var users = Meteor.users.find(
                    {$and: [{"_id":{$in:groupCheck.userIds}},
                    {"_id":{$in:groupCheck.userIdsSurveyed}}]},
                    {sort: { "profile.firstName": 1 }}
                ).fetch();

                if(users.length < 1){
                    throw new Meteor.Error("no_group_member_found");
                }

                //generate rank
                users.forEach(function(user, index, _arr) {
                    generateCardsToChoose(user._id,groupCheck._id,playCardType);
                });

                //if place card mode is not finished, call the "stop" function to remove all data about it as well
                if(!groupCheck.isPlaceCardFinished){
                    Meteor.call('stop.game.place.cards', groupId);
                }

                Group.update({_id:groupId},
                    {
                        $set : {
                            "isActive": true,
                            "playCardTypeActive": playCardType,
                            "isPlaceCardActive":false
                        },
                        $unset : { "currentGroupQuizId": "" }
                    } 
                );
            }else{
                throw (new Meteor.Error("not_all_invitees_finished_survey")); 
            }
            
        }else{
            throw (new Meteor.Error("game_already_started_or_finished")); 
        }
    },

    'stop.game.play.cards': function(groupId,playCardType) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        if(!groupCheck.isFinished){
            if(groupCheck.userIdsSurveyed && groupCheck.userIdsSurveyed.length == groupCheck.userIds.length){
                Group.update({_id:groupId},
                    {
                        $unset : { "playCardTypeActive": "" }
                    }
                );
            }else{
                throw (new Meteor.Error("not_all_invitees_finished_survey")); 
            }
            
        }else{
            throw (new Meteor.Error("game_already_started_or_finished")); 
        }
    },
    'play.card.save.choice': function(groupId, playCardId, choice, grade=0) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        let playCardCheck = PlayCard.findOne({'_id': playCardId,'groupId':groupId});

        if(!playCardCheck){
            throw (new Meteor.Error("unknown_playcard")); 
        }

        if(!groupCheck.isFinished){

            PlayCard.update({_id:playCardId},
                {
                    $set : {
                        "cardChosen":[choice],
                        "grade":grade
                    }
                } 
            );
            
        }else{
            throw (new Meteor.Error("game_already_started_or_finished")); 
        }
    },
    'play.card.self.finish.discussion': function(groupId) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        let playCardType = groupCheck.playCardTypeActive;

        groupCheck.userIds.forEach((userId)=>{
            let playCardCheck = PlayCard.findOne(
                {
                    'playCardType':playCardType,
                    'groupId':groupId,
                    'to':userId,
                    'from':userId,
                    "discussionFinished":true
                }
            );

            if(!playCardCheck){
                PlayCard.update({'playCardType':playCardType,'groupId':groupId,'to':userId,'from':userId},
                    {
                        $set : {
                            "discussionFinished":true
                        }
                    }
                );
            }
        });
    },
    'play.card.finish.discussion': function(groupId, playCardType, targetUserId) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }
        
        PlayCard.update({'playCardType':playCardType,'groupId':groupId,'to':targetUserId, 'from':{$ne:targetUserId}},
            {
                $set : {
                    "discussionFinished":true
                }
            },
            {multi:true}
        );

        //check if all card that needs to be discussed are done
        Meteor.call('play.card.check.completed', groupId,playCardType);
    },
    'play.card.check.completed': function(groupId, playCardType) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        if(!groupCheck.playCardTypeCompleted || groupCheck.playCardTypeCompleted && groupCheck.playCardTypeCompleted.indexOf(playCardType) < 0){
            
            let playCardFinishedCount = PlayCard.find(
                {'playCardType':playCardType,'groupId':groupId,"discussionFinished":true}
            ).count();
            
            if(playCardFinishedCount == (Math.pow(groupCheck.userIds.length, 2))){
                var playCardTypeCompleted = [];
                if(groupCheck.playCardTypeCompleted && groupCheck.playCardTypeCompleted.length > 0){
                    playCardTypeCompleted = groupCheck.playCardTypeCompleted;
                }
    
                if(playCardTypeCompleted.indexOf(playCardType) < 0){
                    playCardTypeCompleted.push(playCardType);
                }
    
                Group.update({'_id':groupId},
                {
                    $set : {
                        "playCardTypeCompleted":playCardTypeCompleted
                    }
                }
                );
            }
        }
    },
    'play.card.next.round': function(groupId) {
        let groupCheck = Group.findOne({'_id': groupId});
        
        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        if(groupCheck.playCardTypeActive && 
            groupCheck.playCardTypeCompleted && 
            groupCheck.playCardTypeCompleted.indexOf(groupCheck.playCardTypeActive) > -1)
        {
            var currentIndex = groupCheck.playCardTypeList.indexOf(groupCheck.playCardTypeActive);
            var nextIndex = currentIndex + 1;
            if(nextIndex < groupCheck.playCardTypeList.length){
                Group.update({'_id':groupId},
                    {
                        $set : {
                            "playCardTypeActive":groupCheck.playCardTypeList[nextIndex]
                        }
                    }
                );

                groupCheck.userIds.forEach((userId, index, _arr) => {
                    generateCardsToChoose(userId,groupCheck._id,groupCheck.playCardTypeList[nextIndex]);
                });
            }
        }
    }
});