   Meteor.methods({

        "mergeAccounts" : function(invitationId){
            if(!Meteor.userId()) {
                throw new Meteor.Error("not_logged_in");
            }

            // TODO :  instead of using users collection , use the connections collection

            /* Rough logic , test and use this 
            var oldUser = Connections.findOne({"services.invitationId": invitationId});
            if(!oldUser){
                throw new Meteor.Error("invalid_token");
            }
            var curUser = _.clone(Meteor.user())
            console.log("mergeAccounts", oldUser.userId, curUser._id);
            Feedback.update({from: oldUser.userId}, {$set : { from : curUser._id}}, {multi : true});
            Feedback.update({to: oldUser.userId}, {$set : { to : curUser._id}}, {multi : true});
            */

            var oldUser = Meteor.users.findOne({"services.invitationId": invitationId});
            if(!oldUser){
                throw new Meteor.Error("invalid_token");
            }
            var curUser = _.clone(Meteor.user())
            console.log("mergeAccounts", oldUser._id, curUser._id);
            Feedback.update({from: oldUser._id}, {$set : { from : curUser._id}}, {multi : true});
            Feedback.update({to: oldUser._id}, {$set : { to : curUser._id}}, {multi : true});
            Meteor.users.remove({ _id: oldUser._id });
        },

        "removeAccounts" : function(id){
            //return Meteor.users.remove({ _id: id});  

            //TODO : Not a good approach ,  So remove the account 
            // in connections collections store the old user id and retrieve it to update

            return Meteor.users.update({_id : id}, {$set : { "emails.0.address" : "" }});
        }


    });
