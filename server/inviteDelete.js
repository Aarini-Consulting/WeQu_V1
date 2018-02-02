Meteor.methods({
    'deletePersonalInvitation' : function (userId) {
        var checkConnection = Connections.findOne({
            groupId: { $exists: false },
            $or:[
                {$and : [ {"inviteId" : Meteor.userId()  }, { "userId" : userId}]},
                {$and : [ { "inviteId" : userId}, {"userId" : Meteor.userId()}]}
                ],
        })
        
        if(checkConnection){
            Connections.remove({
                _id: checkConnection._id
            })

            Feedback.remove(
            {
                groupId: { $exists: false },
                $or:[
                    {$and : [ {"from" : Meteor.userId()  }, { "to" : userId}]},
                    {$and : [ {"from" : userId  }, { "to" : Meteor.userId()}]}
                    ],
            }
        )
        }else{
            throw (new Meteor.Error("invitation_not_found"));
        }
    }
});