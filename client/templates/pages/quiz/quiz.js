  questionDep =  new Tracker.Dependency();
    var currentQuestion = function currentQuestion(questions) {
        questionDep.depend();
        return _.find(questions, function (question) {
            return !_.has(question, 'answer');// || !_.has(question, 'written');
        });
    };

 Template.quiz.helpers({
    'writtenFeedback' : function () {
        var question = currentQuestion(this.feedback.qset);
        !(this.feedback.to == this.feedback.from) && question && _.has(question, 'answer') && !_.has(question, 'written');
        return false;
    },
    'self' : function () {
        return this.feedback.from == this.feedback.to;
    },
    'question' : function () {
        return currentQuestion(this.feedback.qset);
    },
    'questionNum' : function(){
        questionDep.depend();
        var idx = 0
        _.find(this.feedback.qset, function (question) {
            idx++;
            return !_.has(question, 'answer');
        });
        return idx;
    }, 
    'questionsTotal' : function(){
        questionDep.depend();
        return this.feedback.qset.length;
    }
});


 var answering = false;
 Template['quiz'].events({
    "click .answer, click .skip, click .writeAnswer" : function (event, template) {

        event.preventDefault();

        if(answering){
            return;
        }
        answering = true
        var feedback = template.data.feedback;
        var question = currentQuestion(feedback.qset);
        var buttonType = event.target.getAttribute('class');

        if(buttonType == 'answer') {
            question.answer = event.target.getAttribute('id');
            question.written = false;

                // ------ Updating the user gender here ---------
                // attribute data-skill is used to identify the gender question
                // id has the gender details Male or Female 

                var skill = event.target.getAttribute('data-skill')
                if(skill == "genderId")
                {
                    Meteor.users.update({_id: Meteor.userId()},
                      {$set : { "profile.gender": event.target.getAttribute('id') }});
                }

                // After reaching the last question of the set 
                // Display the next person , instead of starting question set 4/4

                var idx = 0;
                _.find(template.data.feedback.qset, function (question) {
                    idx++;
                    return !_.has(question, 'answer');
                });
                console.log("idx = ", idx);

                // Total number of questions ..
                let questionsTotal = template.data.feedback.qset.length; 

                if(idx == questionsTotal+1)
                {
                    console.log(template.data.nextPerson);
                    // Navigate to the next person ..
                    if(template.data.nextPerson == true){
                        var friends = template.data.friends;
                        var idx = friends.indexOf(quizPerson.get())
                        if(idx >= 0 && idx < friends.length - 1){
                            quizPerson.set(friends[idx + 1]);
                        }
                    }
                    // Navigate to the first person (current user) ..
                    else{
                        var friends = template.data.friends;
                        var idx = friends.indexOf(quizPerson.get())
                        if(idx >= 1 && idx < friends.length){
                           // quizPerson.set(friends[idx - 1]);
                           quizPerson.set(friends[0]);
                        }
                    }
                }

            }

            if(buttonType == 'skip'){
                if(_.has(question, 'answer')) {
                    question.written = false
                } else {
                    question.answer = false
                }
            } 
            
            if(buttonType == 'writeAnswer') {
                question.written = template.$('textarea').val();
            }

            Meteor.call('feedback', feedback._id, feedback.qset, function (err, result) {
                if(err) {
                    console.log('feedback error', err);
                }
                if(result){
                    console.log('feedback result',result);
                }
                answering = false;
                questionDep.changed()
                if(!currentQuestion(feedback.qset)) {
                    if(Session.get('invite')){
                        //Session.setPersistent('invite', 'filldata');
                        Session.set('invite', 'filldata');
                    } else if(getLoginScript()) {
                        setLoginScript('after-quiz');
                    } 

                } 
            });
        },
        "click #nextPerson" : function(event, template){
            var friends = template.data.friends;
            var idx = friends.indexOf(quizPerson.get())
            if(idx >= 0 && idx < friends.length - 1){
                quizPerson.set(friends[idx + 1]);
            }
        },
        "click #prevPerson" : function(event, template){
            var friends = template.data.friends;
            var idx = friends.indexOf(quizPerson.get())
            if(idx >= 1 && idx < friends.length){
                quizPerson.set(friends[idx - 1]);
            }
        }
    });