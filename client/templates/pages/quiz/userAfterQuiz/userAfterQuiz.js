

  
Template.userAfterQuiz.created = function () {
	let userId  = Router.current().params.userId ? Router.current().params.userId : ''
	this.userId = new ReactiveVar(userId);
}

Template.userAfterQuiz.helpers({
	invitedPerson(){
		return Meteor.users.findOne({_id: Template.instance().userId.get() });
	}
});


   Template['userAfterQuiz'].events({
        "click #next" : function (event,template) {
            setLoginScript(false);
            let userId =  template.userId.get();
            return Router.go(`/profile/user/${userId}`);
        }
    });