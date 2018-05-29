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
    // 'generate.self.rank.from.csv': function() {
    //     var lines = Papa.parse(Assets.getText("WeQCategory.csv")).data;

    //     if(lines.length > 0){
    //         var result={}
    //         for (var i = 1; i < lines.length; i++) {
    //             if(result[lines[i][0]] && result[lines[i][0]].subCategory){
    //                 if(result[lines[i][0]].subCategory && result[lines[i][0]].subCategory.indexOf(lines[i][1]) < 0){
    //                     result[lines[i][0]].subCategory.push(lines[i][1]);
    //                 }
    //             }else{
    //                 result[lines[i][0]] = {
    //                     subCategory:[lines[i][1]]
    //                 };
    //             }
    //         }

    //         //result has 6 main categories
    //         //each main category has 4 sub-categories
    //         //user needs to get 4 sets of 6 sub-categories
    //         //every set of this 6 sub-categories must have 1 randomly-selected sub-category from each category
    //         //BUT sub-category that has been added to the set of 6 sub-categories CANNOT be used again for other set of 6 sub-categories
    //         var steps={};
    //         for(var r in result){
    //             var quiz = result[r];
    //             var subCategory = quiz.subCategory;

    //             for(var i = subCategory.length-1;i>=0;i--){
    //                 var randomSub = subCategory.splice(Math.floor(Math.random()*subCategory.length), 1);
    //                 if(steps[i]){
    //                     steps[i].push(randomSub[0]);
    //                 }else{
    //                     steps[i]=[randomSub[0]];
    //                 }
    //             }
    //         }
    //     }
    // },
    'save.self.rank': function(groupId,rankItems,firstSwipe) {
        let groupCheck = Group.findOne({'_id': groupId});

        if(!groupCheck){
            throw (new Meteor.Error("unknown_group")); 
        }

        var userCheck = Meteor.users.findOne(Meteor.userId());
        
        var currentRank = FeedbackRank.findOne({
            'from': Meteor.userId(),
            'to': Meteor.userId(),
            'groupId': Meteor.userId()
        });
        var rank;
        var rankFirstSwipe;
        if(currentRank){
            rank = currentRank.rank;
            for(var rItems in rankItems){
                rank[rItems] = rankItems[rItems];
            }
            if(firstSwipe){
                currentRank.firstSwipe.push(firstSwipe);
                rankFirstSwipe = currentRank.firstSwipe;
            }
            
        }else{
            rank = rankItems;

            if(firstSwipe){
                rankFirstSwipe = [firstSwipe];
            }else{
                rankFirstSwipe = [];
            }
        }

        FeedbackRank.upsert({
            'from': Meteor.userId(),
            'to': Meteor.userId(),
            'groupId': Meteor.userId(),
            
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
});