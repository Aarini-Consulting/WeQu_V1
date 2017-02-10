    quizPerson = new ReactiveVar()
    Router.route('/quiz', function(){
        route.set("quiz");
        this.wait(Meteor.subscribe('feedback'));
        if(!this.ready()) {
            this.render('loading');
            return;
        } 
        
        console.log("this");

        var iid = Session.get('invitation-id');
        if(iid) {
            Session.clear("invitation-id");
            Meteor.call("mergeAccounts", iid, function(err, result){
                console.log("mergeAccounts", err, result);
            });
        }
        
        console.log("this");

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

        console.log("this");

        answering = false;
        var userId = quizPerson.get();
        var data = { feedback : Feedback.findOne({to: userId, from: Meteor.userId(), done: false }) }
        data.friends = friends;

        console.log("this");

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
   