Template.adminGameMasterView.created = function () {
	this.count = new ReactiveVar(0);
}

Template.adminGameMasterView.helpers({

	count(){
		let count = Template.instance().count.get();
		return count; 	
	},	

	groupListUsers(){

		let count = Template.instance().count.get();

		return Meteor.users.find({},
		{
			transform: function (doc) {
				doc.gameMaster =  Roles.userIsInRole(doc._id,'GameMaster') == true;
				if(doc.gameMaster){
					count++;
				}
				return doc;
			}
		});
	}	
});

