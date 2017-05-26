Template.strengths.helpers({
	userType() {
      if(quizPerson.get() == Meteor.userId())
        {
          return "My"; 
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