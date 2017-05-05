
Template.step1.helpers({
	listGroup(){
		let data =  Group.find({creatorId: Meteor.userId()});
		return data;
	},
	groupCount(){
		let data =  Group.find({creatorId: Meteor.userId()}).count()<=1;
		console.log(data);
		return data;
	}
});

	