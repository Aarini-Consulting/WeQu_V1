  

  Template.navigateButton.events({
    "click #specificUser" : function(event){
    	   event.preventDefault();
           quizPerson.set(Router.current().params.userId);
           Router.go('/quiz');
           // TO avoid route issue first time
           if(!Router.current().params.userId){
             setLoginScript("quiz");	
           }
           
     }
  });