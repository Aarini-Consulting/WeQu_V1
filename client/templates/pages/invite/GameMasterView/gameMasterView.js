Template.gameMasterView.onCreated(function(){
	  var self = this;
	  self.autorun(function() {
	    self.subscribe("createGroup");
	  });
})

info = new ReactiveVar('');  

Template.gameMasterView.created = function () {
	this.step = new ReactiveVar("step1"); 
	this.groupId = new ReactiveVar();
	this.groupName = new ReactiveVar();
	//this.info = new ReactiveVar('');
}

Template.gameMasterView.helpers({
	groupMembers(){
		let groupId = Template.instance().groupId.get();
		if(groupId)
		{
		 let data = Group.find({_id: groupId }).fetch();
		 return data;
		}
		//return null;
	},

	groupName(){
		let groupId = Template.instance().groupId.get();
		{
		 let data = Group.findOne({_id: groupId }).groupName;
		 return data;
		}
		return null;
	},

	step(){
		return Template.instance().step.get();
	},
	info(){
		return info.get();
	}

});


Template.gameMasterView.events({

	"click #createGroup ,click #next" : function(event,template){
		event.preventDefault();
		template.step.set("step2");
	},

	"submit #send" : function(event,template){
		event.preventDefault();
		var groupName =  template.find('#groupName').value;
        var list_email = $('#list_email').val(); 
        var arr_emails = list_email //.split(',');

        if(!groupName){
          info.set("groupName is empty");
          return false;
        }

        if(arr_emails.length <2){
        	info.set("Please enter atleast two group members ");
        }
        else
        {
	        info.set("Please wait ...");
	        $('#submitSend').prop('disabled',true);
	        Meteor.call('createGroup', groupName, arr_emails , function (err, res) {
	        	if(res){
					    template.step.set("step3");
					    info.set(arr_emails.length);
					}
					if(err)
					{
						template.step.set("step4");
					}     
			});    
    	}

    },

    "click #ok" : function(event,template){
    	event.preventDefault();
    	template.step.set("step1");
    	info.set('');
    },

    "click #back" : function(event,template){
    	event.preventDefault();
    	template.step.set("step2");
    },

    "click #viewGroup" : function (event, template) {
    	let groupId =  $(event.currentTarget).attr('data-groupId');
    	template.step.set("viewGroup"); 
     	template.groupId.set(groupId);
     },

    "click #previous" : function(event,template){
    	event.preventDefault();
    	let step = template.step.get();
    	switch(step){
    		case 'step2':{
    			template.step.set("step1");		
    		}
    		case 'step3':{
    			template.step.set("step2");		
    		}
    		case 'step4':{
    			template.step.set("step3");		
    		}
    		case 'viewGroup':{
    			template.step.set("step1");	
    		}
    	}
    },

    "keypress #groupName" : function(event,template){
    	info.set('');
    }

 });