
inviteStatus = new ReactiveVar('default');
step = new ReactiveVar('default');

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
                                                doc.services = Meteor.users.findOne({_id: doc.userId }) && (Meteor.users.findOne({_id: doc.userId }).services);
                                               if(invitedPerson || invitedPerson2){
                                                doc.invitedPerson = true;
                                                doc.profile = Meteor.users.findOne({_id: doc.inviteId }) && Meteor.users.findOne({_id: doc.inviteId }).profile;
                                                doc.services = Meteor.users.findOne({_id: doc.inviteId }) && (Meteor.users.findOne({_id: doc.inviteId }).services);
                                              }

                                              
                                               return doc;
                                           }
                                     });

        },
   
       usersCount(){
        let count= Connections.find( { $or : [ {inviteId:Meteor.userId()} ,
                                      {email : Meteor.user().emails && Meteor.user().emails[0].address},
                                      {email : Meteor.user().profile && Meteor.user().profile.emailAddress}   ] }                                                       
                                     ).count() > 0;
        if(step.get() != 'invitebttn'){
          return count; 
        } 
        return true;
       }
    })


Template.invite.events({

    "click .step-invitebttn , click .w-inline-block" : function(event,template){
        event.preventDefault();
        step.set('invitebttn'); 
    }

});