 Meteor.publish("connections", function(){
            //if(this.userId) {
                return Connections.find();                
            //}
            //this.ready();
});


 Meteor.publish('feedback', function (allData) {

           var fb = Feedback.find({$or : [ {from : this.userId}, {to : this.userId} ]});
            console.log(allData);
            if(allData == "allData"){    
              let fb = Feedback.find({});
              var users = Meteor.users.find({}, {profile : 1})
              return [fb, users];
            }

            //var userList = fb.map(function(fb){ return [fb.to, fb.from] });
            //userList = _.uniq(_.flatten(users));
            //console.log("userList", userList);
            //var users = Meteor.users.find({_id : {$in : userList}}, {profile : 1});
            var users = Meteor.users.find({}, {profile : 1})
            return [fb, users];
        });


 Meteor.publish('invitation', function (id) {
            var fb = Feedback.findOne(id);
            if(!fb) { return [] }
            return [
                Feedback.find(id),
                Meteor.users.find({ '_id': fb.to }, { 'fields': { 'profile': 1 } })
            ];
        });