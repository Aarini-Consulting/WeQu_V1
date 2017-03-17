  Meteor.methods({
        'addFeedType0' : function (data) {
            console.log(data);
            return Feeds.insert({inviteId: data.inviteId, type: data.type, statement1: data.statement1});
        },
        addFeedType1(data) {
            console.log(data);
            const {type, statement1, statement2} = data;
            return Feeds.insert({ type: type, statement1: statement1, statement2: statement2});
        }

    });