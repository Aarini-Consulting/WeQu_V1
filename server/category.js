Meteor.methods({
    'generate.rank.category.from.csv': function() {
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
        }
    },

    'generate.self.rank': function(userId, groupId) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        Meteor.call( 'generate.rank.category.from.csv', (error, result)=>{
            if(result){
                //result has 6 main categories
                //each main category has 4 sub-categories
                //user needs to get 4 sets of 6 sub-categories
                //every set of this 6 sub-categories must have 1 randomly-selected sub-category from each category
                //BUT sub-category that has been added to the set of 6 sub-categories CANNOT be used again for other set of 6 sub-categories
                var steps={};
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
                    }
                }

                FeedbackRank.upsert({
                    'from': userId,
                    'to': userId,
                    'groupId': groupCheck._id,
                },
                {$set: {
                    'rankItems': steps,
                    }
                });
            }else{
                console.log("error parsing csv")
            }
        });
    },

    'generate.others.rank': function(userId, groupId) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        //get other members in the group
        var users = Meteor.users.find(
            {_id:{$ne:userId},"emails.0.address":{$in:groupCheck.emails}},
            {sort: { "profile.firstName": 1 }}
        ).fetch();

        if(users.length < 1){
            throw new Meteor.Error("no_group_member_found");
        }

        Meteor.call( 'generate.rank.category.from.csv', (error, result)=>{
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
                    var items=[];
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
                        }
                    });
            
                }
            }else{
                console.log("error parsing csv")
            }
        });
    },
    
    'save.self.rank': function(groupId,rankItems,firstSwipe) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        var userCheck = Meteor.users.findOne(Meteor.userId());
        
        var currentRank = FeedbackRank.findOne({
            'from': Meteor.userId(),
            'to': Meteor.userId(),
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
            'from': Meteor.userId(),
            'to': Meteor.userId(),
            'groupId': groupCheck._id,
        },
        {$set: {
            'rank': rank,
            'firstSwipe': rankFirstSwipe,
            }
        });

        if(Object.keys(rank).length == 24){
            var emailsSelfRankCompleted = groupCheck.emailsSelfRankCompleted;
            if(emailsSelfRankCompleted){
                if(emailsSelfRankCompleted.indexOf(userCheck.emails[0].address) == -1){
                    emailsSelfRankCompleted.push(userCheck.emails[0].address);
                }
            }else{
                emailsSelfRankCompleted = [userCheck.emails[0].address];
            }

            Group.update({_id:groupId}, 
                {$set : { "emailsSelfRankCompleted": emailsSelfRankCompleted }});
        }
    },

    'save.others.rank': function(userId,groupId,rankItems,firstSwipe) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        var userCheck = Meteor.users.findOne(userId);
        
        var currentRank = FeedbackRank.findOne({
            'from': Meteor.userId(),
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
            'from': Meteor.userId(),
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
            Group.update({"_id":groupId},
            {'$set':{"isFinished":true}
            });	
        }
    },

    'start.game': function(groupId) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        if(!groupCheck.isActive && !groupCheck.isFinished){
            if(groupCheck.emailsSurveyed && groupCheck.emailsSurveyed.length == groupCheck.emails.length){
                var users = Meteor.users.find(
                    {$and: [{"emails.0.address":{$in:groupCheck.emails}},
                    {"emails.0.address":{$in:groupCheck.emailsSurveyed}}]},
                    {sort: { "profile.firstName": 1 }}
                ).fetch();
        
                if(users.length < 1){
                    throw new Meteor.Error("no_group_member_found");
                }
        
                users.forEach(function(user, index, _arr) {
                    Meteor.call( 'generate.others.rank', user._id, groupCheck._id, (error, result)=>{
                      if(error){
                        console.log(error);
                      }
                    });
                });
        
                Group.update({_id:groupId}, 
                    {$set : { "isActive": true }});

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
    'generate.card.placement': function(groupId) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        if(!groupCheck.isFinished){
            throw (new Meteor.Error("group_not_finished")); 
        }

        if(!groupCheck.isActive){
            throw (new Meteor.Error("group_not_started")); 
        }

        var userCheck = Meteor.users.findOne(Meteor.userId());

        if(!userCheck){
            throw (new Meteor.Error("unknown_user")); 
        }

        var cardPlacementCheck = CardPlacement.findOne({'groupId': groupId,'userId': Meteor.userId()});
        var rankOrder=[];
        var combinedRank={};
        if(!cardPlacementCheck){
            var feedbackRankFromSelf = FeedbackRank.findOne({
                'from': Meteor.userId(),
                'to': Meteor.userId(),
                'groupId': groupCheck._id,
                "rank":{$exists: true}
            });

            if(feedbackRankFromSelf && feedbackRankFromSelf.rank){
                var feedbackRankFromOthers = FeedbackRank.find({
                    'from': {$ne:Meteor.userId()},
                    'to': Meteor.userId(),
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
                //to array
                for(var r in combinedRank){
                    rankOrder.push({"subCategory":r,"value":combinedRank[r]});
                }

                //sort descending (highest value first)
                rankOrder.sort((a, b) => {
                    return b.value - a.value;
                });
            }else{
                throw (new Meteor.Error("completed_self_rank_not_found")); 
            }
        }else{
            rankOrder = cardPlacementCheck.rankOrder;
            combinedRank = cardPlacementCheck.combinedRank;
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
});