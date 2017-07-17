Template.adminGameMasterView.created = function () {
	this.count = new ReactiveVar(0);
}

Template.adminGameMasterView.helpers({

	count(){
		let count = Template.instance().count.get();
		return count; 	
	},	

	groupListUsers(){

		var c;
		var g, gCount, count3=0 ;

		let data = Meteor.users.find({},
		{
			transform: function (doc) {
				doc.gameMaster =  Roles.userIsInRole(doc._id,'GameMaster') == true;
				
			    g = Group.find({creatorId:doc._id}).fetch();
			    gCount = Group.find({creatorId:doc._id}).count();
				doc.groupsCount = 0;
				doc.usersCount = 0;
			    if(gCount>0){
					doc.groupsCount = gCount;
					g.forEach(function (data) {
				        count3+= data.arr_emails_existing.length;
				    });
					doc.usersCount = count3;
			    }
				return doc;
			}
		});
		return data;
	}	
});

