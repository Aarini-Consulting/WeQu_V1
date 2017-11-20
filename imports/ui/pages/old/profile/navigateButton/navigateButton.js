  
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './navigateButton.html';

Template.navigateButton.helpers({
    userType: function () {
      if(quizPerson.get() == Meteor.userId())
        {
          return "myself"; 
        }
      else
        {
          let user = Meteor.users.findOne({_id: quizPerson.get()});
          if(user){
            return getUserName(user.profile);
          }
        }
    }
  });

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