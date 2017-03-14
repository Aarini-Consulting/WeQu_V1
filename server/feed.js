  Meteor.methods({
        'addFeed' : function (data) {
            console.log(data);
            return Feeds.insert({inviteId: data.inviteId, type: data.type, comment: data.comment});
        }
    });