 Meteor.publish("feeds", function(){
            if(this.userId) {
                //return Feeds.find();                
                return Feeds.find({$or : [ {inviteId : this.userId}, {id : this.userId} ]},{limit:25})
            }
            this.ready();
});