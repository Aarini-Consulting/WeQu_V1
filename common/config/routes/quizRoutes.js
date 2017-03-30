    quizPerson = new ReactiveVar()
    Router.route('/quiz', function(){
        route.set("quiz");

        this.layout('ApplicationLayout');

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
        data.userId = userId;

        // data.feedback && !data.feedback.done
        // TODO : Issue here resolve 
        if(!data.feedback.qset) {
            console.log("gen-question-set \n ",userId);
            Meteor.call('gen-question-set', userId, function (err, result) {
                questionDep.changed();
            });
        }
        var user = Meteor.users.findOne({_id : userId});
        if(user) data.person = user.profile;
        data.nextPerson = (friends.indexOf(quizPerson.get()) < friends.length - 1);
        data.prevPerson = (friends.indexOf(quizPerson.get()) > 0)

        this.render('quiz', {data : data});
    }, { 'name': '/quiz' });
