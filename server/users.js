// Meteor.publish('user', (userId) => {
//   return  Meteor.users.find({_id : userId});
// });

// Meteor.publish('users', function () {
//   return Meteor.users.find({});  
// });


Meteor.publish('users', function(selector, options) {
  return Meteor.users.find(selector, options);
});


Meteor.methods({
  'store.profile.picture'(base64String) {
    Meteor.users.update(Meteor.userId(), { 
      '$set': {
          'profile.pictureUrl': base64String,
          'profile.pictureShape': "square"
          } 
      });
  },
  'user.update.name'(firstName, lastName) {
    Meteor.users.update(Meteor.userId(), { 
      '$set': {
          'profile.name': firstName,
          'profile.firstName': firstName,
          'profile.lastName': lastName,
          } 
      });
  },
  'user.update.email'(email) {
    var check = Meteor.users.findOne({_id:Meteor.userId()});

    var oldMail = check.emails[0].address;

    if(check){
      var updatedGroup = 0;
      Group.find(
        {$or : [ 
            { "data.email": oldMail}, 
            { "emails": oldMail},
            { "emailsSurveyed": oldMail}
          ] 
        }
      ).forEach(function(gr){
        var doUpdate = false;

        if(gr.data){
          var check = gr.data.findIndex((d)=>{
            return d.email == oldMail
          })

          if(check && check > -1){
            gr.data[check].email = email;
            doUpdate = true;
          }
        }

        if(gr.emails && Array.isArray(gr.emails)){
          var check = gr.emails.indexOf(oldMail);

          if(check && check > -1){
            gr.emails[check] = email;
            doUpdate = true;
          }
        }

        if(gr.emailsSurveyed && Array.isArray(gr.emailsSurveyed)){
          var check = gr.emailsSurveyed.indexOf(oldMail);

          if(check && check > -1){
            gr.emailsSurveyed[check] = email;
            doUpdate = true;
          }
        }

        if(doUpdate){
          Group.update({_id:gr._id},
            {$set: gr},
            {},
            (err,res) => {
            if(err){
              console.log(err);
            }
          });
          updatedGroup = updatedGroup + 1;
        }
      });

      console.log("updatedGroup: "+ updatedGroup);

      updatedConn = 0;
      Connections.find(
        { "email": oldMail}, 
      ).forEach(function(conn){
        var doUpdate = false;

        if(conn.email == oldMail){
          doUpdate = true;
        }

        if(doUpdate){
          Group.update({_id:conn._id},
            {$set: conn},
            {},
            (err,res) => {
            if(err){
              console.log(err);
            }
          });
          updatedConn = updatedConn + 1;
        }
      });

      console.log("updatedConn: "+updatedConn);
      
      Meteor.users.update(Meteor.userId(), { 
        '$set': {
            'emails.0.address': email,
            } 
        });
    }
  },
  'user.update.gender'(gender) {
    Meteor.users.update(Meteor.userId(), { 
      '$set': {
          'profile.gender': gender,
          } 
      });
  },
})
