function generateRankCategoryFromCsv() {
    var lines = Papa.parse(Assets.getText("WeQCategory.csv")).data;

    if(lines.length > 0){
        var holder={}
        for (var i = 1; i < lines.length; i++) {
            if(holder[lines[i][0]] && holder[lines[i][0]].subCategory){
                if(holder[lines[i][0]].subCategory && holder[lines[i][0]].subCategory.indexOf(lines[i][1]) < 0){
                    holder[lines[i][0]].subCategory.push(lines[i][1]);
                }
            }else{
                holder[lines[i][0]] = {
                    subCategory:[lines[i][1]]
                };
            }
        }

        return holder;
    }else{
        return false;
    }
}

function generateCardFromCsv() {
    var lines = Papa.parse(Assets.getText("WeQCategory.csv")).data;

    if(lines.length > 0){
        var holder={}
        for (var i = 1; i < lines.length; i++) {
            if(holder[lines[i][1]] && holder[lines[i][1]].cards){
                if(holder[lines[i][1]].cards && holder[lines[i][1]].cards.indexOf(lines[i][2]) < 0){
                    holder[lines[i][1]].cards.push(lines[i][2]);
                }
            }else{
                holder[lines[i][1]] = {
                    cards:[lines[i][2]]
                };
            }
        }

        return holder;
    }
}

export function generateSelfRank(userId, groupId) {
    let groupCheck = Group.findOne({'_id': groupId});

    if(!groupCheck){
        throw (new Meteor.Error("unknown_group")); 
    }

    var result = generateRankCategoryFromCsv();
    if(result){
        //result has 6 main categories
        //each main category has 4 sub-categories
        //user needs to get 4 sets of 6 sub-categories
        //every set of this 6 sub-categories must have 1 randomly-selected sub-category from each category
        //BUT sub-category that has been added to the set of 6 sub-categories CANNOT be used again for other set of 6 sub-categories
        var steps={};
        var activeWeights={};
        for(var r in result){
            var quiz = result[r];
            var subCategory = quiz.subCategory;

            for(var i = subCategory.length-1;i>=0;i--){
                var randomSub = subCategory.splice(Math.floor(Math.random()*subCategory.length), 1);
                if(steps[i]){
                    steps[i].push(randomSub[0]);
                }else{
                    steps[i]=[randomSub[0]];
                }

                if(activeWeights[i]){
                    activeWeights[i][randomSub[0]] = false;
                }else{
                    activeWeights[i]=
                        {
                            [randomSub[0]]: false
                        };
                }
            }
        }

        FeedbackRank.upsert({
            'from': userId,
            'to': userId,
            'groupId': groupCheck._id,
        },
        {$set: {
            'rankItems': steps,
            'activeWeights': activeWeights
            }
        });
    }else{
        console.log("error parsing csv")
    }
}

export function generateOthersRank(userId, groupId) {
    let groupCheck = Group.findOne({'_id': groupId});

    if(!groupCheck){
        throw (new Meteor.Error("unknown_group")); 
    }

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

    //check if feedback to others already exist
    var feedbackRankOthersExist = FeedbackRank.findOne(
        {
            groupId:groupCheck._id,
            from:userId,
            to:{$ne:userId}
        }
    );
    var result = generateRankCategoryFromCsv(); 
    //only run this block if no feedback to others found
    if(!feedbackRankOthersExist){
        if(result){
            //result has 6 main categories
            //each main category has 4 sub-categories
            //every user needs to get 1 set of 5 sub-categories
            //this set of 5 sub-categories contains 1 randomly chosen subcategory 
            //from 5 randomly chosen main categories
            //if a subCategory is already chosen, NO other subCategory from the same main category can be used in the same set
            //if a subCategory is already chosen, it cannot be used again for other user
            //a sub categoryif can be reused for other user if all unique subCategory is already chosen 
            //or the remaining subCategory cannot be chosen because current set already contains other subCategory from the same main category
            
            var numUser = users.length;
            var numOfSet = 5;

            var categories = JSON.parse(JSON.stringify(result));
            for(var i=0;i<numUser;i++){
                var items=[]
                var activeWeights={};
                var keys = Object.keys(categories);
                for(var i2=0;i2<numOfSet;i2++){
                    if(keys.length >= 1){
                        //select random category and remove it from the keys array to ensure that it won't be selected again on this set
                        var randomKeys = keys.splice(Math.floor(Math.random()*keys.length), 1);
                        var randomCat =  categories[randomKeys];
                        var subCategory = categories[randomKeys].subCategory;

                        //select random category and remove it from the array to ensure that it won't be selected again on this set
                        var randomSub = subCategory.splice(Math.floor(Math.random()*subCategory.length), 1);
                        
                        items.push(randomSub[0]);
                        activeWeights[randomSub[0]]=false;
                        
                        //if all subCategories from a category is already selected, delete the category
                        if(subCategory.length == 0){
                            delete categories[randomKeys];
                        }
                    }else{
                        //either all unique subCategory already selected or
                        //current set already contains a subCategory from the surviving category data
                        var currentSet = items[items.length-1];
                        
                        //load fresh copy of categories
                        categories = JSON.parse(JSON.stringify(result));
                        keys = Object.keys(categories);

                        //removed keys that already selected in the current set
                        for(var r in categories){
                            var quiz = categories[r];
                            var subCategory = quiz.subCategory;

                            subCategory.some((subCat) => {
                                if(currentSet.indexOf(subCat) > -1){
                                    if(keys.indexOf(r) > -1){
                                        keys.splice(keys.indexOf(r), 1);
                                    }
                                    return true;
                                }else{
                                    return false;
                                }
                            });
                        }

                        //do the same thing again
                        var randomKeys = keys.splice(Math.floor(Math.random()*keys.length), 1);
                        var randomCat =  categories[randomKeys];
                        var subCategory = categories[randomKeys].subCategory;
                        var randomSub = subCategory.splice(Math.floor(Math.random()*subCategory.length), 1);
                        items.push(randomSub[0]);
                        activeWeights[randomSub[0]]=false;
                        
                        if(subCategory.length == 0){
                            delete categories[randomKeys];
                        }
                    }
                }
                
                FeedbackRank.upsert({
                    'from': userId,
                    'to': users[i]._id,
                    'groupId': groupCheck._id,
                    
                },
                {$set: {
                    'rankItems': {0:items},
                    'activeWeights': {0:activeWeights},
                    }
                });
        
            }
        }else{
            console.log("error parsing csv")
        }
    }
}

Meteor.methods({
    'save.self.rank': function(groupId,rankItems,firstSwipe) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        var userCheck = Meteor.users.findOne(this.userId);
        
        var currentRank = FeedbackRank.findOne({
            'from': this.userId,
            'to': this.userId,
            'groupId': groupCheck._id
        });
        var rank;
        var rankFirstSwipe;
        if(currentRank){
            rank = currentRank.rank;
            rankFirstSwipe = currentRank.firstSwipe
            if(!rank){
                rank = {};
            }
            if(!rankFirstSwipe){
                rankFirstSwipe = [];
            }
            for(var rItems in rankItems){
                rank[rItems] = rankItems[rItems];
            }
            if(firstSwipe){
                rankFirstSwipe.push(firstSwipe);
            }
            
        }else{
            rank = rankItems;

            if(firstSwipe){
                rankFirstSwipe = [firstSwipe];
            }else{
                rankFirstSwipe = [];
            }
        }

        FeedbackRank.update({
            'from': this.userId,
            'to': this.userId,
            'groupId': groupCheck._id,
        },
        {$set: {
            'rank': rank,
            'firstSwipe': rankFirstSwipe,
            }
        });

        if(Object.keys(rank).length == 24){
            var userIdsSelfRankCompleted = groupCheck.userIdsSelfRankCompleted;
            if(userIdsSelfRankCompleted){
                if(userIdsSelfRankCompleted.indexOf(userCheck._id) == -1){
                    userIdsSelfRankCompleted.push(userCheck._id);
                }
            }else{
                userIdsSelfRankCompleted = [userCheck._id];
            }

            Group.update({_id:groupId}, 
                {$set : { "userIdsSelfRankCompleted": userIdsSelfRankCompleted }});
        }
    },

    'save.others.rank': function(userId,groupId,rankItems,firstSwipe) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        var userCheck = Meteor.users.findOne(userId);
        
        var currentRank = FeedbackRank.findOne({
            'from': this.userId,
            'to': userId,
            'groupId': groupCheck._id
        });
        var rank;
        var rankFirstSwipe;
        if(currentRank){
            rank = currentRank.rank;
            rankFirstSwipe = currentRank.firstSwipe
            if(!rank){
                rank = {};
            }
            if(!rankFirstSwipe){
                rankFirstSwipe = [];
            }
            for(var rItems in rankItems){
                rank[rItems] = rankItems[rItems];
            }
            if(firstSwipe){
                rankFirstSwipe.push(firstSwipe);
            }
            
        }else{
            rank = rankItems;

            if(firstSwipe){
                rankFirstSwipe = [firstSwipe];
            }else{
                rankFirstSwipe = [];
            }
        }

        FeedbackRank.update({
            'from': this.userId,
            'to': userId,
            'groupId': groupCheck._id,
        },
        {$set: {
            'rank': rank,
            'firstSwipe': rankFirstSwipe,
            }
        });

        var checkNotComplete = FeedbackRank.findOne(
            {
                groupId:groupCheck._id,
                $or : [ {"isSelected":false}, 
                        {"rank":{$exists: false}}
                    ],
            }
        );

        if(!checkNotComplete){
            Group.update({"_id":groupCheck._id},
                {$set : {"isPlaceCardFinished": true}
            });	
        }
    },

    'update.rank.weight': function(groupId,rankId,item,oldPosition, newPosition,currentStep=0) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }
        
        var currentRank = FeedbackRank.findOne({
            'from': this.userId,
            'groupId': groupCheck._id,
            '_id':rankId
        });
        

        if(!currentRank){
            throw (new Meteor.Error("unknown_feedback_rank")); 
        }

        if(currentRank.activeWeights && currentRank.activeWeights[currentStep]){
            var positiveMove = newPosition < oldPosition
            var difference = Math.abs(newPosition - oldPosition);

            var newValue=0;
            if(typeof currentRank.activeWeights[currentStep][item] == "number"){
                newValue = currentRank.activeWeights[currentStep][item];
            }

            if(positiveMove){
                newValue += difference; 
            }else{
                newValue -= difference;
            }

            currentRank.activeWeights[currentStep][item] = newValue;
            
            FeedbackRank.update({
                'from': this.userId,
                'groupId': groupCheck._id,
                '_id':rankId
            },
            {$set: {
                'activeWeights': currentRank.activeWeights,
                }
            });
        }
    },

    'start.game.place.cards': function(groupId) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        if(groupCheck && groupCheck.userIds && groupCheck.userIds.length < 2){
            throw (new Meteor.Error("not_enough_group_member")); 
        }

        if(groupCheck && groupCheck.userIds && groupCheck.userIds.length > 12){
            throw (new Meteor.Error("too_much_group_member")); 
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
                    generateOthersRank(user._id, groupCheck._id)
                });
        
                Group.update({_id:groupId},
                    {
                        $set : {"isActive": true,"isPlaceCardActive": true},
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

    'stop.game.place.cards': function(groupId) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        if(!groupCheck.isFinished){
            if(groupCheck.userIdsSurveyed && groupCheck.userIdsSurveyed.length == groupCheck.userIds.length){
                FeedbackRank.update(
                    {"groupId":groupCheck._id},
                    {
                        $unset : { 
                            "rank": "",
                            "firstSwipe":"",
                            "isSelected":""
                        }
                    },
                    {multi:true}
                );
                  
                CardPlacement.remove(
                    {
                        "groupId": groupCheck._id
                    });

                if(groupCheck.currentGroupQuizId){
                    Group.update({_id:groupId},
                        {
                            $set : {
                                "isPlaceCardActive": false,
                                "userIdsSelfRankCompleted":[]
                            }
                        } 
                    );
                }else{
                    Group.update({_id:groupId},
                        {
                            $set : {
                                "isActive":false,
                                "isPlaceCardActive": false,
                                "userIdsSelfRankCompleted":[]
                            }
                        } 
                    );
                }
                
            }else{
                throw (new Meteor.Error("not_all_invitees_finished_survey")); 
            }
            
        }else{
            throw (new Meteor.Error("game_already_started_or_finished")); 
        }
    },

    'end.game': function(groupId) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        if(!groupCheck.isActive && !groupCheck.isFinished){
            if(groupCheck.userIdsSurveyed && groupCheck.userIdsSurveyed.length == groupCheck.userIds.length){

                var checkNotComplete = FeedbackRank.findOne(
                    {
                        groupId:groupCheck._id,
                        $or : [ {"isSelected":false}, 
                                {"rank":{$exists: false}}
                            ],
                    }
                );
        
                if(!checkNotComplete){
                    Group.update({"_id":groupId},
                    {'$set':{"isFinished":true}
                    });	
                }else{
                    throw (new Meteor.Error("not_all_invitees_finished_survey")); 
                }

            }else{
                throw (new Meteor.Error("not_all_invitees_finished_survey")); 
            }
            
        }else{
            throw (new Meteor.Error("game_already_started_or_finished")); 
        }
    },

    'set.readiness': function(groupId,feedbackRankId) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        if(groupCheck.isActive && !groupCheck.isFinished){
            var feedbackRankCheck = FeedbackRank.findOne({'_id': feedbackRankId});

            if(!feedbackRankCheck){
                throw (new Meteor.Error("unknown_quiz_rank")); 
            }

            FeedbackRank.update({_id:feedbackRankCheck._id}, 
                {$set : { "isSelected": true }});
            
        }else{
            throw (new Meteor.Error("game_not_started_or_already_finished")); 
        }
    },
    'combine.rank.data': function(groupId,userId) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        if(!groupCheck.isActive){
            throw (new Meteor.Error("group_not_started")); 
        }

        var userCheck = Meteor.users.findOne(this.userId);

        if(!userCheck){
            throw (new Meteor.Error("unknown_user")); 
        }

        var cardPlacementCheck = CardPlacement.findOne({'groupId': groupId,'userId': userId});
        var rankOrder=[];
        var combinedRank={};
        if(!cardPlacementCheck){
            var feedbackRankFromSelf = FeedbackRank.findOne({
                'from': userId,
                'to': userId,
                'groupId': groupCheck._id,
                "rank":{$exists: true}
            });

            if(feedbackRankFromSelf && feedbackRankFromSelf.rank){
                var feedbackRankFromOthers = FeedbackRank.find({
                    'from': {$ne:userId},
                    'to': userId,
                    'groupId': groupCheck._id,
                    "rank":{$exists: true}
                }).fetch();

                var rankFromSelf = feedbackRankFromSelf.rank;
                
                //get rank from self rank
                //For self rank, each rank quiz set consist of 6 unique sub categories from the main categories
                //therefore, score point range is from 1 to 6
                for(var r in rankFromSelf){
                    if(combinedRank[r]){
                        var average = (combinedRank[r] + rankFromSelf[r])/2 
                        combinedRank[r]=average;
                    }else{
                        combinedRank[r]=rankFromSelf[r];
                    }
                }
                //For other rank, each rank quiz set consist of 5 uniquely-selected sub categories from 6 main categories
                //therefore, score point range is from 1 to 5, so need to convert the score to the same range (in this case 6)
                feedbackRankFromOthers.forEach((feedbackRank, index, _arr) => {
                    var rankFromOther = feedbackRank.rank;
                    for(var r in rankFromOther){
                        var converted = (rankFromOther[r]/Object.keys(rankFromOther).length) * 6;
                        if(combinedRank[r]){
                            var average = (combinedRank[r] + converted)/2 
                            combinedRank[r]=average;
                        }else{
                            combinedRank[r]=converted;
                        }
                    }
                });

                var resultCategories = generateRankCategoryFromCsv();
                var mainCatValues = Object.values(resultCategories);
                var mainCatKeys = Object.keys(resultCategories);
                //to array
                for(var r in combinedRank){
                    var mainCatIndex = mainCatValues.findIndex((cat) => {
                        return cat.subCategory.indexOf(r) > -1;
                    });
                    rankOrder.push({"category":mainCatKeys[mainCatIndex], "subCategory":r,"value":combinedRank[r]});
                }

                //sort descending (highest value first)
                rankOrder.sort((a, b) => {
                    return b.value - a.value;
                });
            }else{
                throw (new Meteor.Error("completed_self_rank_not_found")); 
            }

            CardPlacement.upsert({groupId:groupCheck._id, userId:userCheck._id}, 
                {$set : { 
                    "userId": userCheck._id,
                    "groupId": groupCheck._id,
                    "combinedRank":combinedRank,
                    "rankOrder":rankOrder
    
                }
            });
        }

        var readyForPicking = CardPlacement.find(
            {
                groupId:groupCheck._id,
                cardPicked:{$exists: false}
            }
        ).fetch();

        if(readyForPicking.length == groupCheck.userIds.length){
            Meteor.call('pick.card', groupCheck._id);
        }
    },
    'pick.card': function(groupId) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        if(!groupCheck.isActive){
            throw (new Meteor.Error("group_not_started")); 
        }

        var users = Meteor.users.find(
            {"_id":{$in:groupCheck.userIds}}
        ).fetch();

        if(users.length < 1){
            throw new Meteor.Error("no_group_member_found");
        }

        var resultCategories = generateRankCategoryFromCsv();
        var resultCards = generateCardFromCsv();

        if(resultCategories){
            var categories = JSON.parse(JSON.stringify(resultCategories));
            var cardList = JSON.parse(JSON.stringify(resultCards));

            users.forEach(function(user, index, _arr) {
                var cardPlacementCheck = CardPlacement.findOne({
                    'groupId': groupId,'userId': user._id,"combinedRank":{$exists: true},"rankOrder":{$exists: true}
                });
                if(cardPlacementCheck){
                    var top = cardPlacementCheck.rankOrder;
                    var low = cardPlacementCheck.rankOrder.slice().reverse();

                    var pickTop = 4;
                    var pickLow = 3;

                    var topPicked = []
                    var lowPicked = [];
                    var cardPicked = [];

                    var categoryKeys = Object.keys(categories);

                    //get the first 4 category from the top
                    top.forEach((topRank) => {
                        if(topPicked.length < pickTop){
                            var categoryIndex = categoryKeys.indexOf(topRank.category);
                            if(categoryIndex > -1){
                                var subCategoryIndex = categories[topRank.category].subCategory.indexOf(topRank.subCategory)
                                var subCategoryCards = cardList[topRank.subCategory].cards;

                                //check if cards from this subcategory still available to pick
                                if(subCategoryIndex > -1 && subCategoryCards.length > 0){
                                    //selected
                                    topPicked.push(topRank);

                                    //pick card
                                    var randomCard = subCategoryCards.splice(Math.floor(Math.random()*subCategoryCards.length), 1);
                                    cardPicked.push(
                                        {
                                            category:topRank.category,
                                            subCategory:topRank.subCategory, 
                                            cardId:randomCard[0]
                                        });

                                    //removed from subcategory pool
                                    categories[topRank.category].subCategory.splice(subCategoryIndex, 1);

                                    //removed from main category pool
                                    categoryKeys.splice(categoryIndex, 1);
                                }
                            }
                        }
                    });

                    //refresh categoryKeys before getting the remaining 3 category from the bottom
                    categoryKeys = Object.keys(categories);

                    //get the remaining 3 category from the bottom
                    low.forEach((lowRank) => {
                        if(lowPicked.length < pickLow){
                            var categoryIndex = categoryKeys.indexOf(lowRank.category);
                            if(categoryIndex > -1){
                                var subCategoryIndex = categories[lowRank.category].subCategory.indexOf(lowRank.subCategory)
                                var subCategoryCards = cardList[lowRank.subCategory].cards;

                                //check if cards from this subcategory still available to pick
                                if(subCategoryIndex > -1 && subCategoryCards.length > 0){
                                    //selected
                                    lowPicked.push(lowRank);
                                    
                                    //pick card
                                    var randomCard = subCategoryCards.splice(Math.floor(Math.random()*subCategoryCards.length), 1);
                                    cardPicked.push(
                                        {
                                            category:lowRank.category,
                                            subCategory:lowRank.subCategory, 
                                            cardId:randomCard[0]
                                        });

                                    //removed from subcategory pool
                                    categories[lowRank.category].subCategory.splice(subCategoryIndex, 1);

                                    //removed keys from main category keys pool
                                    categoryKeys.splice(categoryIndex, 1);
                                }
                            }
                        }
                    });
                    var holder =  {"top":topPicked,"low":lowPicked};

                    CardPlacement.update({groupId:groupCheck._id, userId:user._id}, 
                        {$set : { 
                            "cardPicked": cardPicked,
                        }
                    });
                }else{
                    console.log("rank_not_combined_or_sorted");
                }
            });
    
        }
    }
});