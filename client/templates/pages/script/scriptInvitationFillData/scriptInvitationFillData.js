 Template.scriptInvitationFillData.onCreated(function(){
    var user = Meteor.user()
    if(user && user.profile && user.profile.firstName && user.profile.pictureUrl) {
        finishInviteScript();
    }
});

 Template.scriptInvitationFillData.created = function () {

        // Avoid session and get the invitation id using the url
        let invitationId = Router.current().params._id;

        Tracker.autorun(function(){
            Meteor.subscribe('invitation', invitationId);
        })

        this.invitationId = new ReactiveVar(invitationId);
    }

    Template.scriptInvitationFillData.helpers({

        data(){
            let invitationId = Template.instance().invitationId.get();
            let data;

            if(invitationId){
                var feedback = Feedback.findOne({_id : invitationId})
                if(feedback){
                    data =  calculateTopWeak([feedback]);                
                    data.person = Meteor.users.findOne({_id : feedback.to}).profile;
                }
                return data;
            }
            return null;
        }

    });