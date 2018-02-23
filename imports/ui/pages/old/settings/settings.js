import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './settings.html';

 Template.settings.helpers({
  	profile(){
  		return Meteor.user() && Meteor.user().profile;
  	}
  })

Template.settings.events({
    "click #logout" : function(){
          Meteor.logout();
          Router.go('/signIn');
       }
});