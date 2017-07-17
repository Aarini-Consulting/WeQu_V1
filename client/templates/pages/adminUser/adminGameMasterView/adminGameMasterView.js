Template.adminGameMasterView.created = function () {
	this.count = new ReactiveVar(0);
	var self = this;
	self.autorun(function() {
		self.subscribe("connections");
		self.subscribe("group");
		self.subscribe("feedback","allData");
		self.subscribe("usersInfo");  
	});
}

Template.adminGameMasterView.onCreated(function() {
	
});


Template.adminGameMasterView.helpers({

	count(){
		let count = Template.instance().count.get();
		return count; 	
	},	

	groupListUsers(){

		var c=0;
		var g, gCount, count3=0 ;
		var allEmails = [];

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
					count3 = 0;
					allEmails = [];
					g.forEach(function (data) {
						data.arr_emails_existing.forEach(function (d) {
				           allEmails.push(d);
				        });
				    });
				    allEmails = [...new Set(allEmails)];
      				count3 = allEmails.length;
					doc.usersCount = count3;
			    }
			    
				return doc;
			}
		});
		
		data.fetch().forEach(function (data) {
			c = data.gameMaster == true ? ++c : c ; 
		});
		Template.instance().count.set(c);
		return data;
	}	
});

