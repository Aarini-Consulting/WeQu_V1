Template.skillSet.helpers({

	sectionEmpty(){
		let count= Connections.find( { $or : [ {inviteId:Meteor.userId()} ,
                                      {email : Meteor.user().emails && Meteor.user().emails[0].address},
                                      {email : Meteor.user().profile && Meteor.user().profile.emailAddress}   ] }                                                       
                                     ).count();
        let countAlpha="", i= 3;
        let count2= i-count;
        if(count2==1){
        	countAlpha = "ONE"
        }
        if(count2==2){
        	countAlpha = "TWO"
        }
        if(count2==3){
        	countAlpha = "THREE"
        }
    let bool = quizPerson.get() == Meteor.userId()  && count <3;
		return {
			isTrue: bool,
			count : countAlpha
		}
	},
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