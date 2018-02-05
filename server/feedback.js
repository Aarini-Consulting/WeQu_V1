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

            if(qset == [] || qset.length == 0 ){
                throw new Meteor.Error("qset undefined");
            }
            
            let a = Feedback.insert({from: fb.from, to: fb.to, qset: qset, done : false});
            // console.log(qset , a , fb);

            return true;
        },
        'feedback.answer.question'(fb) {
            Feedback.update({
                _id:fb._id,
              },
              {$set: {
                from:fb.from,
                to:fb.to,
                qset: fb.qset,
                done:fb.done,
                lastUpdated:new Date()
              }   
            },
            (error, result) => {
                if(error){
                    console.log(error);
                    return error;
                }else if(fb.done){
                    if(fb.from == fb.to) {
                        fb.qset = genInitialQuestionSet("You", qdata.type1you, 12);
                    } else {
                        var user = Meteor.users.findOne({ _id: fb.to });
                        fb.qset = genQuizQuestionSet(user.profile);
                    }
        
                    if(fb.qset == [] || fb.qset.length == 0 ){
                        throw new Meteor.Error("qset undefined");
                    }
                    
                    if(fb.groupId){
                        Feedback.insert({from: fb.from, to: fb.to, qset: fb.qset,groupId:fb.groupId, groupName:fb.groupName, done : false});
                    }else{
                        let a = Feedback.insert({from: fb.from, to: fb.to, qset: fb.qset, done : false});
                        // console.log(qset , a , fb);
                    }
                   
                }
                return true;
            });
        }
    });
