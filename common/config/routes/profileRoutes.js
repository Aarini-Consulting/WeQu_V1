 
    //Display profile

    Router.route('/profile/user/:userId', function () {
        route.set("profile");
        this.layout('ApplicationLayout');
        this.wait(Meteor.subscribe('feedback'),     Accounts.loginServicesConfigured());
        if(this.ready()){

            // Replacing userId with custom Id
            var id = this.params.userId;
            let user = Meteor.users.findOne({_id : id});
            if(user){

                let userId = user._id;
                var myfeedback = Feedback.find({ 'from': userId, 'to' : Meteor.userId() }).fetch();
                var data = { profile : user.profile };
                data.userId = userId;
                data.myscore = calculateScore(joinFeedbacks(myfeedback));
                var otherFeedback = Feedback.find({ 'from': { '$ne': userId }, 'to' : userId }).fetch();
                var qset = joinFeedbacks(otherFeedback);
                var validAnswers = _.filter(qset, function(question) { return question.answer });
                data.otherscore = calculateScore(qset);
                data.enoughData = (validAnswers.length > 30);

                //Profile should have carousal to navigate to other users profile


                //Temporary ------- Sorting not works because of this
               
                var feedbacks = Feedback.find().fetch();
                var friends =  _.chain(feedbacks).map(function(feedback){
                    return [feedback.from, feedback.to];
                }).flatten().uniq().sortBy().value();

                friends = Meteor.users.find( {_id : {$in : friends}},{ profile : 1}).map(function(user){
                                          return user._id;
                                      });
                data.friends = friends;
                // Temporary Ends -----------

                if(friends.indexOf(quizPerson.get()) < 0) {
                    quizPerson.set(friends[0]);
                }



                var user = Meteor.users.findOne({_id : userId});
                if(user) data.person = user.profile;
                data.nextPerson = (friends.indexOf(quizPerson.get()) < friends.length - 1);
                data.prevPerson = (friends.indexOf(quizPerson.get()) > 0);

                console.log(data);

                _.extend(data, calculateTopWeak(Feedback.find({to: userId }).fetch()))  
                this.render('displayProfile', { data : data});  
            }
        } 
        else {
            this.render('loading');
        }
    }, { 'name': '/profile/user/:userId' });


     Router.route('/profile/skills/:userId', function () {
        route.set("skills");
        this.layout('ApplicationLayout');
        this.wait(Meteor.subscribe('feedback'));
        if(this.ready()){

             // Replacing userId with custom Id
            var id = this.params.userId;
            let user = Meteor.users.findOne({_id : id});

            if(user)
            {

            let userId = user._id;
            var data = { profile : user.profile };
            data.userId = userId;
            var otherFeedback = Feedback.find({ 'to' : userId }).fetch();
            var joinedQset = joinFeedbacks(otherFeedback);

            var validAnswers = _.filter(joinedQset, function(question) { return question.answer });
            var otherscore = calculateScore(joinedQset, true);
            data.enoughData = (validAnswers.length > 9);

            data.categories = _.map(_.keys(framework), function(category) {
                return {
                    name : i18n[category],
                    category : category,
                    skills : _.map(framework[category], function(skill){
                        var data = {name : i18n[skill], value: 0, scored: otherscore.scored[skill], total: otherscore.total[skill], skill: skill, category: category }
                        if(otherscore.total[skill] > 0) {
                            data.value = Math.round(otherscore.scored[skill] * 100 / otherscore.total[skill]);
                        }
                        return data;
                    })
                }
            })
            this.render('profileSkills', { data : data });
            }

        } else {
            this.render('loading');
        }
    }, { 'name': '/profile/skills/:userId' });



      // Profile routing starts ..

      Router.route('/profile', function () {
        route.set("profile");
        this.layout('ApplicationLayout');
        this.wait(Meteor.subscribe('feedback'),     Accounts.loginServicesConfigured());
        if(this.ready()){
            var myfeedback = Feedback.find({ 'from': Meteor.userId(), 'to' : Meteor.userId() }).fetch();
            var data = { profile : Meteor.user().profile };
            data.myscore = calculateScore(joinFeedbacks(myfeedback));

            var otherFeedback = Feedback.find({ 'from': { '$ne': Meteor.userId() }, 'to' : Meteor.userId() }).fetch();
            var qset = joinFeedbacks(otherFeedback);

            var validAnswers = _.filter(qset, function(question) { return question.answer });
            data.otherscore = calculateScore(qset);
            data.enoughData = (validAnswers.length > 30);

            _.extend(data, calculateTopWeak(Feedback.find({to: Meteor.userId()}).fetch()))
            this.render('profile', { data : data});
        } else {
            this.render('loading');
        }
    }, { 'name': '/profile' });

      Router.route('/profile/skills', function () {
        route.set("skills");
        this.layout('ApplicationLayout');
        this.wait(Meteor.subscribe('feedback'));
        if(this.ready()){
            var data = { profile : Meteor.user().profile }
            var otherFeedback = Feedback.find({ 'to' : Meteor.userId() }).fetch();
            var joinedQset = joinFeedbacks(otherFeedback);

            var validAnswers = _.filter(joinedQset, function(question) { return question.answer });
            var otherscore = calculateScore(joinedQset, true);
            data.enoughData = (validAnswers.length > 15);

            data.categories = _.map(_.keys(framework), function(category) {
                return {
                    name : i18n[category],
                    category : category,
                    skills : _.map(framework[category], function(skill){
                        var data = {name : i18n[skill], value: 0, scored: otherscore.scored[skill], total: otherscore.total[skill], skill: skill, category: category }
                        if(otherscore.total[skill] > 0) {
                            data.value = Math.round(otherscore.scored[skill] * 100 / otherscore.total[skill]);
                        }
                        return data;
                    })
                }
            })
            this.render('profileSkills', { data : data });

        } else {
            this.render('loading');
        }
    }, { 'name': '/profile/skills' });

      Router.route('/profile/written-feedback', function () {
        route.set("feedback");
        this.layout('ApplicationLayout');
        return this.render('profileWrittenFeedback', {
            'data': function () { return Meteor.user(); }
        });
    }, { 'name': '/profile/written-feedback' });


    // Profile routing ends ..





