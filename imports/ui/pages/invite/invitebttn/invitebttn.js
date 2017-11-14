
Template.invitebttn.created = function () {
        this.gender = new ReactiveVar('Male'); // Setting default to male , since in UI default value is male
}


Template.invitebttn.events({

	"click .back" : function(event,template){
		event.preventDefault();
		step.set('default');
	},
	"submit form" : function (event, template) {
        event.preventDefault();
        inviteStatus.set('sending');
        var email = template.$('input[name=email]').val().toLowerCase();
        var name = template.$('input[name=name]').val();

        var gender = template.gender.get(); //template.find('#gender').value;

        // Sending invite email to self , avoided .

        if(email == ( Meteor.user() && Meteor.user().emails && Meteor.user().emails[0].address ) || 
            email == ( Meteor.user() && Meteor.user().profile.emailAddress ) ){
                inviteStatus.set('error');
                setInterval(function () {
                    return inviteStatus.set('default');
                }, 3000);
        }

        else
        {
             let oldUser = Connections.findOne( { $and : [   {"email":email},{"inviteId": Meteor.userId()} ] } );
             let exists = !oldUser ? false : true;
             console.log(exists);

             if(!exists){
                Meteor.call('invite', name, email, gender, function (err, userId) {
                    if(err){
                        console.log("error", err);
                        inviteStatus.set('error');
                        return;
                    }
                    template.$('input[name=name]').val('')
                    template.$('input[name=email]').val('');
                    inviteStatus.set('sent');

                    setTimeout(function(){
                        step.set('default');
                        return inviteStatus.set('default');
                    }, 3000);
                        quizPerson.set(userId);
                        console.log(err, userId);
                        return setLoginScript('finish');
                });
            }
            else{
                inviteStatus.set('alreadyInvited');
                setInterval(function () {
                        return inviteStatus.set('default');
                }, 3000);
            }
        }

    },
    "click #next" : function () {
        return setLoginScript('finish');
    },
    "click #m" : function(event,template){
        //event.preventDefault();
        template.gender.set('Male');
    },

    "click #f" : function(event,template){
        //event.preventDefault();
        template.gender.set('Female');
    }
    


});


  Template.invitebttn.rendered = function(){

        $('.gender').on('click', function(){
            if(!$(this).hasClass('selected'))
            {
                $('.gender').toggleClass('selected');
            }
        });

 }


    

    