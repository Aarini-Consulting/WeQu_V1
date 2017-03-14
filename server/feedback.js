  Meteor.methods({
        'feedback' : function (id, qset,type) {
            var done = !_.find(qset, function (question) { return !_.has(question, 'answer'); });
            Feedback.update({ '_id': id }, { '$set': { 'qset': qset, done: done } });
            var fb = Feedback.findOne({_id : id});
            if(!fb || !done){

                   // my friend rates me then type 1 
                   // I rate my friends them type 2

                   // Determine type by comparing the feedback from , to id's with Meteor.userId()
                   
                   let data = { type : type,    comment: `sasas`  }

                    Meteor.call('addNormalFeed', data, function (err, result) {
                      if(err)
                        {
                          console.log(err);
                        }
                        if(result){
                          console.log(result);
                        }
                    });


                return;
            }

            if(fb.from == fb.to) {
                qset = genInitialQuestionSet("You", qdata.type1you, 12);
            } else {
                var user = Meteor.users.findOne({ _id: fb.to });
                qset = genQuizQuestionSet(user.profile);
            }
            Feedback.insert({from: fb.from, to: fb.to, qset: qset, done : false})
        }
    });
