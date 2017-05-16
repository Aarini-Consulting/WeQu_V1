  

  Template.navigateButton.events({
    "click #specificUser" : function(event){
    	   event.preventDefault();
           quizPerson.set(Router.current().params.userId);
           Router.go('/quiz');
     }
  });