Template.step2.rendered = function () {
    
    $(".tags").select2({tags: true, width: '100%', placeholder: 'emails',  
    	createTag: function(term, data) {
    		var value = term.term;
    		if(validateEmail(value)) {
    			return {
    				id: value,
    				text: value
    			};
    		}
    		return null;            
    	}
    });

    function validateEmail(email) {
    	var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	let user = Meteor.users.findOne({$or : [ {"emails.address" : email }, { "profile.emailAddress" : email }]})
        // Avoiding self user invite
        if(user){
            return false;
        }
        return re.test(email);
    }


};


Template.step2.events({

});