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
    },
    topWeak(){
      let userId = Router.current() && Router.current().params.userId;
      if(!userId){
        return true;
      }
      let data = calculateTopWeak(Feedback.find({to: userId }).fetch());
      if(data){
        let condition =  data.top3.length>0 && data.weak3.length>0 ;
        return condition;
      }
    }
});