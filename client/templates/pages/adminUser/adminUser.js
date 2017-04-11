
Template.adminUser.onCreated(function() {
	var self = this;
	self.autorun(function() {
		self.subscribe("connections");
		self.subscribe("feedback");
		self.subscribe("usersInfo");  
	});
});


Template.adminUser.created = function () {

	this.search = new ReactiveVar(0);

	let template = Template.instance();

	Tracker.autorun(function () {
		let search = template.search.get();
		if (search) {
			Meteor.subscribe("usersInfo", search);
		} else {
			Meteor.subscribe("usersInfo");
		}
	});
}

Template.adminUser.helpers({
	listusers(){

      /*  let principalFilter = Template.instance().principalFilter.get();
      let agentFilter = Template.instance().agentFilter.get(); */
      let search = Template.instance().search.get(); 
      let filter = [];

      if(search){
      	filter.push({
      		_id: {$ne: Meteor.userId()}
      	});
      }

      /*  if (principalFilter)
            filter.push({"profile.userType": "principal"});

        if (agentFilter)
            filter.push({"profile.userType": "agent"});

        if (filter.length > 0) {
            filter = {
                $or: filter
            }
        } else {
            filter = {};
        } */

        filter ={};

        return Meteor.users.find(
        	filter,
        	{
        		transform: function (doc) {
                    //picture
                 //   let data = ProfilePicture.findOne({_id: doc.profile.profilePicture});
                 //   doc.picture = data && data.url();
                 return doc;
             }
         });
    },
    route: function(status) {
    	return status == route.get();
    },
    loggedIn: function(){
    	return !Meteor.userId();
    }
});

 Template.adminUser.events({
      "click #logout" : function(){
          Meteor.logout();
          Router.go('/adminLogin');
       },

      "click #user" : function(event,template){
          event.preventDefault();
          Modal.show('adminViewUserProfile'); // Adding Master Admin functionality to view user's profile.
      }
      
   });