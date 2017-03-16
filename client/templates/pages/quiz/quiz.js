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

        var skill = event.target.getAttribute('data-skill');

        if(buttonType == 'answer') {
            question.answer = event.target.getAttribute('id');
            question.written = false;

            // TODO: Prepare comment in UI , rather than js

            // ----------------- Inserting data into the feeds collection --------------- //
            var id = event.target.getAttribute('id')

            //console.log(question.answers, id   );

             // my friend rates me then type 1 
             // I rate my friends them type 2

             var type, comment;

             //TYPE  1 answer myself 
             if( feedback.from === feedback.to && feedback.from === Meteor.userId()  ){
                type =1;
                  if (question.answers[0]._id == event.target.getAttribute('id'))
                    {
                        comment = `You think you are more ${question.answers[0].skill} than ${question.answers[1].skill} `;
                    }

                     if (question.answers[1]._id == event.target.getAttribute('id'))
                    {
                        comment = `You think you are more ${question.answers[1].skill} than ${question.answers[0].skill} `;
                    }
             }

             /*
               if(type == 2)
               {
                    var name=' ivan ' ;
                    if (question.answers[0]._id == event.target.getAttribute('id'))
                    {
                        comment = `You think ${name} is ${question.answers[0].skill} more than ${question.answers[1].skill} `;
                    }

                     if (question.answers[1]._id == event.target.getAttribute('id'))
                    {
                        comment = `You think ${name} is ${question.answers[1].skill} more than ${question.answers[0].skill} `;
                    }

                }

                if(type == 1){
                    var comment , name=' David ' ;
                    if (question.answers[0]._id == event.target.getAttribute('id'))
                    {
                        comment = `${name} thinks you're more ${question.answers[0].skill} than ${question.answers[1].skill} `;
                    }

                     if (question.answers[1]._id == event.target.getAttribute('id'))
                    {
                        comment = `${name} thinks you're more ${question.answers[1].skill} than ${question.answers[0].skill}  `;
                    }
                } */
            
               let data = {type : type , comment: comment};

               if(skill != "genderId"){
                 if(type){
                      Meteor.call('addNormalFeed', data, function (err, result) {
                          if(err)
                          {
                              console.log(err);
                          }
                      });
                    }
                }


                // ------ Updating the user gender here ---------
                // attribute data-skill is used to identify the gender question
                // id has the gender details Male or Female 
                
                if(skill == "genderId")
                {
                    Meteor.users.update({_id: Meteor.userId()},
                      {$set : { "profile.gender": event.target.getAttribute('id') }});
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