Meteor.methods({
        'gen-question-set' : function (userId) {
            check(Meteor.userId(), String);
            var user = Meteor.users.findOne({_id : userId});
            var name = userId;
            var qset;
            if(userId == Meteor.userId()) {
                qset = genInitialQuestionSet("You", qdata.type1you, 13);
                console.log("you");
            } else{
              console.log("profile ",user.profile);
                qset = genQuizQuestionSet(user.profile);
            }

            Feedback.upsert({
                'from': Meteor.userId(),
                'to': userId
            }, {
                'from': Meteor.userId(),
                'to': userId,
                'qset': qset,
                'done': false,
            });
            return qset;
        }
    });
