Template.threeSkills.helpers({
	swapDescription() {
		let data = Template.instance().swapDescription.get();
		return data;
	}
});


Template.threeSkills.created = function () {
	this.swapDescription = new ReactiveVar(false);
};


Template.threeSkills.events({
	'click .swapDescription': function (event,template) {
		event.preventDefault();
		let isTrue = template.swapDescription.get();
		if(isTrue)
			template.swapDescription.set(false);
		else
			template.swapDescription.set(true);
	}
});