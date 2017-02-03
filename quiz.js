if(Meteor.isClient) {
    quizPerson = new ReactiveVar()
    Router.route('/quiz', function(){
        route.set("quiz");
        this.wait(Meteor.subscribe('feedback'));
        if(!this.ready()) {
            this.render('loading');
            return;
        }

        var iid = Session.get('invitation-id');
        if(iid) {
            Session.clear("invitation-id");
            Meteor.call("mergeAccounts", iid, function(err, result){
                console.log("mergeAccounts", err, result);
            });
        }

        var feedbacks = Feedback.find().fetch()
        var friends =  _.chain(feedbacks).map(function(feedback){
            return [feedback.from, feedback.to];
        }).flatten().uniq().sortBy().value();
        //TODO: some friends disappear from friendlist???
        var friends = Meteor.users.find({_id : {$in : friends}}, {profile : 1}).map(function(user){
            return user._id;
        });

        if(friends.length == 0) {
            this.render('quizNothing');
            return;
        } 

        if(friends.indexOf(quizPerson.get()) < 0) {
            quizPerson.set(friends[0]);
        }

        answering = false;
        var userId = quizPerson.get();
        var data = { feedback : Feedback.findOne({to: userId, from: Meteor.userId(), done: false }) }
        data.friends = friends;

        if(!data.feedback) {
            Meteor.call('gen-question-set', userId, function (err, result) {
                questionDep.changed();
                console.log('gen-question-set', err);
            });
        }
        var user = Meteor.users.findOne({_id : userId});
        if(user) data.person = user.profile;
        data.nextPerson = (friends.indexOf(quizPerson.get()) < friends.length - 1);
        data.prevPerson = (friends.indexOf(quizPerson.get()) > 0)

        this.render('quiz', {data : data});
    }, { 'name': '/quiz' });

    var questionDep =  new Tracker.Dependency();
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
            console.log(this.feedback.qset);
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
                answering = false;
                questionDep.changed()
                if(!currentQuestion(feedback.qset)) {
                    if(Session.get('invite')){
                        Session.setPersistent('invite', 'filldata');
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
}

if(Meteor.isServer) {
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
                qset = genQuizQuestionSet(getUserName(user.profile));
            }
            Feedback.insert({from: fb.from, to: fb.to, qset: qset, done : false})
        }
    });
}
