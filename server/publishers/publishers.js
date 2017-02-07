 Meteor.publish("connections", function(){
            //make linkedin api call
            if(this.userId) {
                //make api call
                //this.added("connections", 1, {firstName : "Ilya Ovdin"});
            }
            this.ready();
        });