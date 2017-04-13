

 Template.gameMasterView.created = function () {
        this.step = new ReactiveVar("step1"); 
        this.groupName = new ReactiveVar();
 }

Template.gameMasterView.helpers({

	listGroup(){
		return null;
	},

	groupMembers(){
		return null;
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

    "click #send" : function(event,template){
        event.preventDefault();

        res = true; error=false;
        if(res){
        	template.step.set("step3");
        }
        if(error)
        {
        	template.step.set("step4");
        }
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
     	console.log(groupId);
     	template.step.set("viewGroup");

     	//TODO: Retrieve group name from the groupId
     	template.groupName.set(groupId);

     }

})