 Meteor.publish("connections", function(){
            //make linkedin api call
            if(this.userId) {
                //make api call
                //this.added("connections", 1, {firstName : "Ilya Ovdin"});
            }
            this.ready();
        });


 Meteor.publish('feedback', function () {
            var fb = Feedback.find({$or : [ {from : this.userId}, {to : this.userId} ]});
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