//  Meteor.publish("connections", function(){
//             //if(this.userId) {
//                 return Connections.find();                
//             //}
//             //this.ready();
// });

Meteor.publish("connections", function(selector, options){
    //if(this.userId) {
        return Connections.find(selector, options);                
    //}
    //this.ready();
});


//  Meteor.publish('feedback', function (data) {

//         //    var fb = Feedback.find({$or : [ {from : this.userId}, {to : this.userId} ]});
//         //    var users; 
//         //     if(data == "allData"){    
//         //       fb = Feedback.find({});
//         //       users = Meteor.users.find({}, {profile : 1})
//         //       return [fb, users];
//         //     }
//         //     users = Meteor.users.find({}, {profile : 1})
//         //     return [fb, users];

//             return Feedback.find();
//         });

<<<<<<< HEAD
           var fb = Feedback.find({$or : [ {from : this.userId}, {to : this.userId} ]});
           var users; 
           //**************  Commenting out to check the data load , public user profile page is related to this *****
           // --------------  Verify this before moving to production ----------------
           if(data == "allData"){    
              fb = Feedback.find({});
              users = Meteor.users.find({}, {profile : 1})
              return [fb, users];
            }
            users = Meteor.users.find({}, {profile : 1})
            return [fb, users];
        });
=======
Meteor.publish('feedback', function(selector, options) {
    return Feedback.find(selector, options);
    });
>>>>>>> dev-yw


 Meteor.publish('invitation', function (id) {
            var fb = Feedback.findOne(id);
            if(!fb) { return [] }
            return [
                Feedback.find(id),
                Meteor.users.find({ '_id': fb.to }, { 'fields': { 'profile': 1 } })
            ];
        });