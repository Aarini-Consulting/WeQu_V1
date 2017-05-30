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
	'click .swapDescription1': function (event,template) {
		event.preventDefault();
		
		$(event.currentTarget).toggleClass('active');
		let skill = $(event.currentTarget).attr('data-skill');
		let c = ".swap2"+skill;
		$(c).toggleClass('active');
		
	},
	'click .swapDescription2': function (event,template) {
		event.preventDefault();
		
		$(event.currentTarget).toggleClass('active');
		let skill = $(event.currentTarget).attr('data-skill');
		let c = ".swap1"+skill;
		$(c).toggleClass('active');
		
	}
});