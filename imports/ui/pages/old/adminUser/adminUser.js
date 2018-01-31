import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './adminUser.html';

Template.adminUser.onCreated(function() {
	var self = this;
	self.autorun(function() {
		self.subscribe("connections");
		self.subscribe("feedback","allData");
		self.subscribe("usersInfo");  
	});
});


Template.adminUser.created = function () {

	this.search = new ReactiveVar(0);
  this.swapView = new ReactiveVar(false);

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
                 doc.gameMaster =  Roles.userIsInRole(doc._id,'GameMaster') == true;
                 return doc;
               }
             });
        },

     groupListUsers(){

        return Meteor.users.find({},
           {
            transform: function (doc) {
                 doc.gameMaster =  Roles.userIsInRole(doc._id,'GameMaster') == true;
                 return doc;
               }
             });
      },

      swapView(){
        return  Template.instance().swapView.get(); 
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

  "click .switch" : function(event,template){
    event.preventDefault();
    let userId = $(event.currentTarget).attr('data-userId');
    Meteor.call('addRoleGameMaster', userId , function (err, result) {
   });
  },

  "click #user" : function(event,template){
    //event.preventDefault();
    let userId = $(event.currentTarget).attr('data-userId');
    if(userId != Meteor.userId())
    {
      Modal.show('adminViewUserProfile', {userId:userId } ); // Adding Master Admin functionality to view user's profile.
    }
   },

  "click #view1" : function(event,template){
    event.preventDefault();
    template.swapView.set(false);
   },
  "click #view2" : function(event,template){
    event.preventDefault();
    template.swapView.set(true);
   }
});