  

  Template.navigateButton.events({
    "click #specificUser" : function(event){
    	   event.preventDefault();
           if(Router.current().params.userId){
            quizPerson.set(Router.current().params.userId);
           }
           Router.go('/quiz');
           // TO avoid route issue first time
           let condition = getLoginScript() == false ; // Already activated then do nothing
           if(!Router.current().params.userId && !condition){
             setLoginScript("quiz");	
           }
           
     }
  });