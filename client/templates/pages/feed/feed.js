Template.feed.helpers({
	feeds(){

		 // For some reason sort is not working  
		/* let data = Feeds.find( {}, {
	                    transform: function (doc) {
	                        doc.userInfo = Meteor.users.findOne({_id: doc.inviteId});
	                        doc.displayTrue = Meteor.users.findOne({_id: doc.inviteId})&& Meteor.users.findOne({_id: doc.inviteId})._id == Meteor.userId();
	                        doc.filter = false;
	                        if(Meteor.users.findOne({_id: doc.id})){
							  doc.filter =  Meteor.users.findOne({_id: doc.id})._id == Meteor.userId() ? true : false ;
	                        } 
	                        return doc;
	                    }      
                   } ,{sort: {createdAt: 1}} ); */
         
         // TODO :  USE the above logic .

         data = Feeds.find({},{sort: {createdAt: -1} });

 	     let data2 = [];
 	     let i=0;
		 data.forEach(function (doc) {
		 	 doc.userInfo = Meteor.users.findOne({_id: doc.inviteId});
             doc.displayTrue = Meteor.users.findOne({_id: doc.inviteId})&& Meteor.users.findOne({_id: doc.inviteId})._id == Meteor.userId();
             doc.filter =  Meteor.users.findOne({_id: doc.id}) && Meteor.users.findOne({_id: doc.id})._id == Meteor.userId() ? true : false ;
             data2[i] = doc;
             i++;
		 });

		 return data2;

		}    

});



