import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './admin.html';

Template.admin.onCreated(function () {
        console.log("admin loaded");
      });
    

Template['admin'].events({
        "click #import" : function () {
            Meteor.call('import');
        },
        'click #reset' : function () {
            setLoginScript('init');
            Meteor.call("reset", function(err, result){
                Router.go('/');
            })
        },
        'click #logout' : function(){
            Meteor.logout();
        },
        'click #login' : function(){
            Meteor.call("loginTestUser", function(err, result){
                console.log("loginTestUser", err, result);
                Meteor.loginWithPassword(result, result, function(err, result){
                    console.log("loginWithPassword", err, result)
                });
            });
        } 
    });