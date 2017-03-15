Template.feed.helpers({
	feeds(){

		 return Feeds.find({},{
	                    transform: function (doc) {
	                        doc.userInfo = Meteor.users.findOne({_id: doc.inviteId});
	                        doc.displayTrue = Meteor.users.findOne({_id: doc.inviteId})&& 
	                        					Meteor.users.findOne({_id: doc.inviteId})._id == Meteor.userId()
	                        return doc;
	                    }      
                   }, {sort: {createdAt: 1}  }); 

                //return Feeds.find({});

		

	}


});



