  Template['displayProfile'].events({
    "click #nextPerson" : function(event, template){
      event.preventDefault();
      var friends = template.data.friends;
      var idx = friends.indexOf(quizPerson.get())
      if(idx >= 0 && idx < friends.length - 1){
          userId =  friends[idx + 1] ;
          quizPerson.set(friends[idx + 1]);
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
        Router.go(`/profile/user/${userId}`); 
        
      }
    }

});