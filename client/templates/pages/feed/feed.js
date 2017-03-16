Template.feed.helpers({
	feeds(){

		 return Feeds.find({}, {sort: {createdAt: -1}  }, {
	                    transform: function (doc) {
	                        doc.userInfo = Meteor.users.findOne({_id: doc.inviteId});
	                        doc.displayTrue = Meteor.users.findOne({_id: doc.inviteId})&& 
	                        					Meteor.users.findOne({_id: doc.inviteId})._id == Meteor.userId();
	                        doc.filter = Meteor.users.findOne({_id: doc.id}) === Meteor.userId();
	                        console.log(doc);
	                        return doc;
	                    }      
                   }); 
	     }    

});



