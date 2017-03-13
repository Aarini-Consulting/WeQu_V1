  Meteor.methods({
        'feedback' : function (id, qset) {
            var done = !_.find(qset, function (question) { return !_.has(question, 'answer'); });
            Feedback.update({ '_id': id }, { '$set': { 'qset': qset, done: done } });
            var fb = Feedback.findOne({_id : id});
            if(!fb || !done){
                return;
            }

            if(fb.from == fb.to) {
                qset = genInitialQuestionSet("You", qdata.type1you, 12);
            } else {
                var user = Meteor.users.findOne({ _id: fb.to });
                qset = genQuizQuestionSet(user.profile);
            }
            Feedback.insert({from: fb.from, to: fb.to, qset: qset, done : false})

            return true;
        }
    });
