 Meteor.publish("feeds", function(){
            if(this.userId) {
                //return Feeds.find();                
                return Feeds.find({$or : [ {inviteId : this.userId}, {id : this.userId} ]},{createdAt:-1})
            }
            this.ready();
});