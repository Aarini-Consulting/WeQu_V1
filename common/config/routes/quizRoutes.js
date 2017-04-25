    quizPerson = new ReactiveVar()
    Router.route('/quiz/:groupId?', function(){
        route.set("quiz");

        this.layout('ApplicationLayout');

        this.wait([ Meteor.subscribe('feedback') , Meteor.subscribe('group') ] );
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

        //var feedbacks = Feedback.find().fetch();

        // 1. Group Quiz Person

        var feedbacks = Feedback.find({ 'invite': { '$ne': true } }).fetch();
        var feedbacks2 = {} ;

        // Finding Count 
        var friends2 =  _.chain(feedbacks).map(function(feedback){
            return [feedback.from, feedback.to];
        }).flatten().uniq().sortBy().value();

        var feedbacksCount = Meteor.users.find( { $and: [  {_id : {$in : friends2}}, 
                                                     { '_id': { '$ne': Meteor.userId() } } ]
                                         } , 
                                         { profile : 1}).count();


        //3. User without a group
        feedbacks =  Feedback.find({invite:true}).fetch();
        feedbacks.concat(feedbacks2);

        var friends =  _.chain(feedbacks).map(function(feedback){
            return [feedback.from, feedback.to];
        }).flatten().uniq().sortBy().value();
                
        // Ordering the quiz person list 

        var condition;
        

        var friends = Meteor.users.find( { $and: [  {_id : {$in : friends}}, 
                                                     { '_id': { '$ne': Meteor.userId() } } ]
                                         } , 
                                         { profile : 1}).map(function(user){
                                          condition = Connections.findOne({userId: user._id}) ? true : false;
                                                      return user._id;
                                                            });
        

       //TODO : group invited person not should be normal person's quiz list 
       // map it accordingly to hide 
       // Add a new profile data groupInvited and refer that 

        friends =  friends.filter(groupInvited);
        function groupInvited(data) {
            let user = Meteor.users.findOne({_id:data , "profile.groupQuizPerson": true });
            let condition = user ? false : true;
            if(condition){
            return data ;
            }
        } 

        // Filter current user in the quiz list if group invited
        var groupId=  Router.current() && Router.current().params.groupId;
        if (groupId)
        {
            let currentGroup = Group.findOne({_id :groupId});
            if(currentGroup){

                //TODO : Create questions for Group members 

                try{

                let arr_emails = currentGroup.emails;

                arr_emails = arr_emails.filter(isNewUser); // Filtering existing members

                  function isNewUser(email){
                    user = Meteor.users.findOne({$or : [ {"emails.address" : email  }, { "profile.emailAddress" : email }]} );
                    if (!user) 
                      return email;
                  };

                  var data;

                  for (i = 0; i < arr_emails.length; i++) {
                   /* user = Meteor.users.findOne({$or : [ {"emails.address" : arr_emails[i]  }, { "profile.emailAddress" : arr_emails[i] }]} );
                    data = { feedback : Feedback.findOne({to: user._id, from: Meteor.userId(), done: false }) }

                    if(data.feedback){
                        if(!data.feedback.qset)  {
                         console.log("gen-question-set \n ",userId);
                             Meteor.call('gen-question-set', userId, function (err, result) {
                                questionDep.changed();
                            }); 
                        }
                    }
                    else{
                        console.log("gen-question-set \n ",userId);
                             Meteor.call('gen-question-set', userId, function (err, result) {
                                questionDep.changed();
                            }); 
                    } */

                  }
              }
              catch(e){
                console.log(e , "Error Create questions for Group members");
              }


            }
        } 

        console.log(feedbacksCount);
        // 2. Myself
        friends.splice (feedbacksCount ,0, Meteor.userId());

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

        if(data.feedback){
            if(!data.feedback.qset) {
                console.log("gen-question-set \n ",userId);
                Meteor.call('gen-question-set', userId, function (err, result) {
                    questionDep.changed();
                });
            }
        }

        var user = Meteor.users.findOne({_id : userId});
        if(user) data.person = user.profile;
        data.nextPerson = (friends.indexOf(quizPerson.get()) < friends.length - 1);
        data.prevPerson = (friends.indexOf(quizPerson.get()) > 0)

        this.render('quiz', {data : data});
        }, { 'name': '/quiz/:groupId' });
