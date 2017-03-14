 Meteor.publish("feeds", function(){
            if(this.userId) {
                return Feeds.find();                
            }
            this.ready();
});