
Template.step1.helpers({
	listGroup(){
		let data =  Group.find({creatorId: Meteor.userId()});
		return data;
	}
});

	