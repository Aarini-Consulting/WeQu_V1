  Meteor.methods({
        'addFeed' : function (data) {
            console.log(data);
            return Feeds.insert({inviteId: data.inviteId, type: data.type, comment: data.comment});
        },
        addNormalFeed(data) {
            console.log(data);
            return Feeds.insert({ type: data.type, comment: data.comment});
        }

    });