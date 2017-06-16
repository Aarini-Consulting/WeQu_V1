  
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
        top = capitalizeFirstLetter(top);
        let gender_result = gender == "Male" ? 'his': 'her';
        let url = `http://app-test.wequ.co/profile/publicUser/${userId}`;
    	let tex = `Discover ${username}’s character skills. ${top} is one of ${gender_result}  best quality! ${url} Powered by @playWeQu` ;
        let linkTitle = `Discover ${username}’s character skills` ;
        let linkSummary = ` ${top} is one of ${gender_result} best quality! &#xA; Learn more about ${username} ${url} Powered by WeQu`;
    	let dat = {
            tex:tex,
            linkTitle:linkTitle,
            linkSummary : linkSummary
        }
        return dat;
    },
    url(){
        let userId = Meteor.userId();
        return `http://app-test.wequ.co/profile/publicUser/${userId}`
    }

});