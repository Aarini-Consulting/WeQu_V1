  
Template.shareSocial.helpers({
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
        let gender_result = gender == "Male" ? 'his': 'her';
    	let tex = `Discover ${username}’s character skills. ${top} is one of ${gender_result}  best quality! http://app-test.wequ.co/profile/publicUser/${userId} Powered by @playWeQu` ;
        let linkTex = `Discover ${username}’s character skills. ${top} is one of ${gender_result}  best quality! Learn more about ${username} http://app-test.wequ.co/profile/publicUser/${userId} Powered by WeQu`;
    	let dat = {
            tex:tex,
            linkTex : linkTex
        }
        return dat;
    },
    url(){
        let userId = Meteor.userId();
        return `http://app-test.wequ.co/profile/publicUser/${userId}`
    }

});