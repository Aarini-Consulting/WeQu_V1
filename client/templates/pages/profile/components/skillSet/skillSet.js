Template.skillSet.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe("group");
  });
});

Template.skillSet.helpers({

	sectionEmpty(){
		let count= Connections.find( { $or : [ {inviteId:Meteor.userId()} ,
                                      {email : Meteor.user().emails && Meteor.user().emails[0].address},
                                      {email : Meteor.user().profile && Meteor.user().profile.emailAddress}   ] }                                                       
                                     ).count();
    let email = ( Meteor.user() && Meteor.user().emails && Meteor.user().emails[0].address ) || ( Meteor.user()  && Meteor.user().profile.emailAddress) ;
    let g, gCount, count3=0 ;
    let allEmails = [];
    g = Group.find({emails:email}).fetch();
    gCount = Group.find({emails:email}).count();
    if(gCount>0){
      g.forEach(function (data) {
         data.emails.forEach(function (d) {
           allEmails.push(d);
         });
        
        //count3+= data.emails.length;
      });
      allEmails = [...new Set(allEmails)];
      count3 = allEmails.length;
    }
    let countAlpha="", i= 3;
    let count2= i-count-count3 ;
    if(count2==1){
    	countAlpha = "ONE"
    }
    if(count2==2){
    	countAlpha = "TWO"
    }
    if(count2==3){
    	countAlpha = "THREE"
    }
    let bool = quizPerson.get() == Meteor.userId()  && count+count3 <3;
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