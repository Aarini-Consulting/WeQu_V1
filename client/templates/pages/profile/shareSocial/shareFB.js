  
Template.shareFB.helpers({
	 userId(){
      return Meteor.userId();
    },
    text(){
    	let username = getUserName(Meteor.user().profile);
    	let gender = Meteor.user().profile && Meteor.user().profile.gender;
    	var top;
    	let userId = quizPerson.get();
	    let data = calculateTopWeak(Feedback.find({to: userId }).fetch());
    	if(data){
        	top =  data.top3[0] && data.top3[0].skill;
        }
        let gender_result = gender == "male" ? 'He': 'She';
    	let tex = `Discover ${username}'s character skills. ${gender_result} is great at ${top}! URL @playWeQu`;
    	return tex;
    },
    url(){
        let userId = Meteor.userId();
        return `http://app-test.wequ.co/profile/publicUser/${userId}`
    }
});