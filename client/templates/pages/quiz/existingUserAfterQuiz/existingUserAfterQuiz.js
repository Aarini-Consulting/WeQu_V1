

  
Template.existingUserAfterQuiz.created = function () {
	let userId  = Router.current().params.userId ? Router.current().params.userId : ''
	this.userId = new ReactiveVar(userId);
}

Template.existingUserAfterQuiz.helpers({
	invitedPerson(){
		return Meteor.users.findOne({_id: Template.instance().userId.get() });
	}
});


   Template['existingUserAfterQuiz'].events({
        "click #next" : function (event,template) {
            //setLoginScript('profile');
            let userId =  template.userId.get();
            return Router.go(`/profile/user/${userId}`);
        }
    });