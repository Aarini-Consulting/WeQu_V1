  import '/imports/startup/client/wequ-profile.webflow.css';

  Template['profile'].events({
    "click #finish" : function(){
      //setLoginScript('invite');
      Router.go('/invite');
    },
    "click #nextPerson" : function(event, template){
      event.preventDefault();
      var friends = template.data.friends;
      var idx = friends.indexOf(quizPerson.get())
      if(idx >= 0 && idx < friends.length - 1){
        userId =  friends[idx + 1] ;
        quizPerson.set(friends[idx + 1]);
        if(userId == Meteor.userId())
          Router.go(`/profile`); 
        else
          Router.go(`/profile/user/${userId}`); 
      }
    },
    "click #prevPerson" : function(event, template){
      event.preventDefault();
      var friends = template.data.friends;
      var idx = friends.indexOf(quizPerson.get())
      if(idx >= 1 && idx < friends.length){
        userId =  friends[idx - 1] ;
        quizPerson.set(friends[idx - 1]);
        if(userId == Meteor.userId())
          Router.go(`/profile`);
        else
          Router.go(`/profile/user/${userId}`); 
      }
    },

    /** #69 -scroll static fix content **/
    "scroll #feed" : function(event,template){
           
           var scroll = template.firstNode.scrollTop;
           
          if (scroll >= 300) {
            $("#sectionprogress").addClass('fix-search');
          } else {
            $("#sectionprogress").removeClass("fix-search");
           }
     },

    "click .fb-share-button" : function(event, template){ 
      
      event.preventDefault();

      let userId = Meteor.userId();
       FB.ui({
          method: 'share',
          display: 'popup',
          href: 'https://app.wequ.co',
      }, function(response){});

   }



  });

  Template.profile.helpers({
  	profile(){
  		return Meteor.user().profile;
  	},

    displayRadar(){
      
      let data = Template.instance().result.get();
      if(data){
        console.log(data);
        return data;
      }        
      return null;
    }
  })

  Template.profile.created = function () {
    this.result = new ReactiveVar();    
  };


  Template.profile.rendered = function () {

    let template = Template.instance();

    Meteor.subscribe('feedback');

    quizPerson.set(Meteor.userId());

    //Re-write as a function - Re-use it

    Tracker.autorun(function () {

      let handle = Meteor.subscribe('feedback');

      if(handle.ready() && Accounts.loginServicesConfigured())
      {
            // Replacing userId with custom Id
            var id = quizPerson.get();
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

                _.extend(data, calculateTopWeak(Feedback.find({to: userId }).fetch())) 

                template.result.set(data);

              }

            }
          });

  }

