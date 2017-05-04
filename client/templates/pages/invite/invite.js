
inviteStatus = new ReactiveVar('default');
step = new ReactiveVar('default');

Template.invite.created = function () {
        this.gender = new ReactiveVar('Male'); // Setting default to male , since in UI default value is male
        normalView = true;
        normalView = new ReactiveVar(normalView);

}

    Template.invite.helpers({
        users(){// TODO : Re-write this logic .
            // { $or : [ {inviteId:Meteor.userId()} , {email : Meteor.user().emails && Meteor.user().emails[0].address}   ] }
            return Connections.find( { $or : [ {inviteId:Meteor.userId()} ,
                                               {email : Meteor.user().emails && Meteor.user().emails[0].address},
                                               {email : Meteor.user().profile && Meteor.user().profile.emailAddress}   ] } ,
                                     {
                                           transform: function (doc)
                                           {
                                               let invitedPerson = doc.email ==(Meteor.user().emails && Meteor.user().emails[0].address);
                                               // Linked in login
                                               let invitedPerson2 = doc.email == (Meteor.user().profile && Meteor.user().profile.emailAddress);
                                               doc.invitedPerson = false;
                                               if(invitedPerson || invitedPerson2){
                                                doc.invitedPerson = true;
                                                doc.profile = Meteor.users.findOne({_id: doc.inviteId }) && Meteor.users.findOne({_id: doc.inviteId }).profile;
                                               }
                                               //console.log(doc);
                                               return doc;
                                           }
                                     });

        },
       normalView(){
          return normalView.get(); 
       },
       usersCount(){
        let count= Connections.find( { $or : [ {inviteId:Meteor.userId()} ,
                                      {email : Meteor.user().emails && Meteor.user().emails[0].address},
                                      {email : Meteor.user().profile && Meteor.user().profile.emailAddress}   ] }                                                       
                                     ).count() > 0;
        if(step.get() != 'invitebttn' ){
         return count;
        }
        return false;
       }
    })



    Template.invite.events({

    "click .formbttn" : function (event, template) {
        console.log("event");
        event.preventDefault();
        inviteStatus.set('sending');
        var email = template.$('input[name=email]').val();
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

                    setInterval(function () {
                        step.set('default');
                        return inviteStatus.set('default');
                    }, 3000);
                        quizPerson.set(userId);
                        return setLoginScript('finish');
                        console.log(err, userId);
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
    "click #male" : function(event,template){
        event.preventDefault();
        template.gender.set('Male');
    },

    "click #female" : function(event,template){
        event.preventDefault();
        template.gender.set('Female');
    },

    "click .invitebttn , click .w-inline-block" : function(event,template){
        event.preventDefault();
        step.set('invitebttn');
    }
    
})


    Template.invite.rendered = function(){

        $('.gender').on('click', function(){
            if(!$(this).hasClass('selected'))
            {
                $('.gender').toggleClass('selected');
            }
        });

    }
