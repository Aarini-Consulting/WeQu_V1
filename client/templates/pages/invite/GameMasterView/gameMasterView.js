Template.gameMasterView.onCreated(function(){
	  var self = this;
	  self.autorun(function() {
	    self.subscribe("createGroup");
	  });
})

Template.gameMasterView.created = function () {
	this.step = new ReactiveVar("step1"); 
	this.groupId = new ReactiveVar();
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

	step(){
		return Template.instance().step.get();
	}


});


Template.gameMasterView.events({

	"click #createGroup" : function(event,template){
		event.preventDefault();
		template.step.set("step2");
	},

	"submit #send" : function(event,template){
		event.preventDefault();
		var groupName =  template.find('#groupName').value;
        //var emails = template.$('input[name=emails]').val();
        var list_email = $('#list_email').val(); 
        var arr_emails = list_email //.split(',');

        Meteor.call('createGroup', groupName, arr_emails , function (err, res) {
        	if(res){
				    template.step.set("step3");
				}
				if(err)
				{
					template.step.set("step4");
				}     
			});    

    },

    "click #ok" : function(event,template){
    	event.preventDefault();
    	template.step.set("step1");
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
    } 

 });