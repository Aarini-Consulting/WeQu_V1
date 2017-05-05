
inviteStatus = new ReactiveVar('default');
step = new ReactiveVar('default');

Template.invite.created = function () {
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

    "click .step-invitebttn , click .w-inline-block" : function(event,template){
        event.preventDefault();
        step.set('invitebttn'); 
    }

});