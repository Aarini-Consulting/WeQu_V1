   Meteor.methods({
        /* "getMergeToken" : function(){
            if(!Meteor.userId()) {
                throw new Meteor.Error("not_logged_in");
            }

            var token = Random.secret();
            Meteor.users.update({_id : Meteor.userId}, {$set : { "services.merge.token" : token }});
            return token;
        },*/
        "mergeAccounts" : function(invitationId){
            if(!Meteor.userId()) {
                throw new Meteor.Error("not_logged_in");
            }
            var oldUser = Meteor.users.findOne({"services.invitationId": invitationId});
            if(!oldUser){
                throw new Meteor.Error("invalid_token");
            }
            var curUser = _.clone(Meteor.user())
            console.log("mergeAccounts", oldUser._id, curUser._id);
            Feedback.update({from: oldUser._id}, {$set : { from : curUser._id}}, {multi : true});
            Feedback.update({to: oldUser._id}, {$set : { to : curUser._id}}, {multi : true});
            Meteor.users.remove({ _id: oldUser._id });
        }
    });
    