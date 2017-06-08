Template.publicUser.helpers({
	profile() {

		let userId = Router.current() && Router.current().params.userId;
		let user =  Meteor.users.findOne({_id: userId });  
		if(user){
			return user.profile;
		}
		return null;
	}
});