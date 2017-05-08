Template.step2.rendered = function () {
    
    $(".tags").select2({tags: true, width: '100%', placeholder: ' email addresses',  
    	createTag: function(term, data) {
    		var value = term.term;
    		if(validateEmail(value)) {
                info.set('');
                return {
                    id: value,
                    text: value
                };
            }
            return null;            
        },
        "language": {
         "noResults": function(){
             return "";
         }
     },
     escapeMarkup: function (markup) {
        return markup;
    }

});

    function validateEmail(email) {
    	var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	let currentEmail = Meteor.user().emails && Meteor.user().emails[0] && Meteor.user().emails[0].address ||
     Meteor.user() && Meteor.user().profile && Meteor.user().profile.emailAddress;
     let user = email == currentEmail;
        // Avoiding self user invite
        if(user){
            return false;
        }
        return re.test(email);
    }


};


Template.step2.events({

});