 Meteor.publish("group", function(){
          //  if(this.userId) {
                return Group.find();                
          //  }
          //  this.ready();
});