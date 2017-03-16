Template.feed.helpers({
	feeds(){

		 return  Feeds.find( {}, {
	                    transform: function (doc) {
	                        doc.userInfo = Meteor.users.findOne({_id: doc.inviteId});
	                        doc.displayTrue = Meteor.users.findOne({_id: doc.inviteId})&& Meteor.users.findOne({_id: doc.inviteId})._id == Meteor.userId();
	                        doc.filter =  Meteor.users.findOne({_id: doc.id}) && Meteor.users.findOne({_id: doc.id})._id == Meteor.userId() ? true : false ;
	                       // console.log(doc);
	                        return doc;
	                    }      
                   } ).fetch();  // For some reason sort is not working  {sort: {createdAt: -1} }
		}    

});



