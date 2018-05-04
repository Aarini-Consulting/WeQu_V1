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
    var currentUser = Meteor.users.findOne({_id:Meteor.userId()});
    var oldMail = currentUser.emails[0].address;

    if(currentUser){
      var checkEmail = Meteor.users.find({_id:{$ne:Meteor.userId()},"emails.0.address":email}).fetch();

      if(checkEmail.length > 0){
        throw new Meteor.Error("email already in use");
      }
      
      var updatedGroup = 0;
      Group.find(
        {$or : [
            { "emails": oldMail},
            { "emailsSurveyed": oldMail}
          ] 
        }
      ).forEach(function(gr){
        var doUpdate = false;

        if(gr.emails){
          var check = gr.emails.indexOf(oldMail);

          if(check > -1){
            gr.emails[check] = email;
            doUpdate = true;
          }
        }

        if(gr.emailsSurveyed){
          var check = gr.emailsSurveyed.indexOf(oldMail);

          if(check > -1){
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

      updatedConn = 0;
      Connections.find(
        { "email": oldMail}, 
      ).forEach(function(conn){
        var doUpdate = false;

        if(conn.email == oldMail){
          conn.email = email;
          doUpdate = true;
        }

        if(doUpdate){
          Connections.update({_id:conn._id},
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
  'user.delete'() {
    var currentUser = Meteor.users.findOne({_id:Meteor.userId()});
    var userMail = currentUser.emails[0].address;

    if(currentUser){
      var groupOwnedByUser = Group.find({"creatorId":currentUser._id}).fetch();
      if(groupOwnedByUser.length > 0){
        throw new Meteor.Error("not allowed to delete groupowner");
      }
      Group.find(
        {$or : [
            { "emails": userMail},
            { "emailsSurveyed": userMail}
          ] 
        }
      ).forEach(function(gr){
        var doUpdate = false;

        if(gr.emails){
          var check = gr.emails.indexOf(userMail);

          if(check > -1){
            gr.emails.splice(check, 1);
            doUpdate = true;
          }
        }

        if(gr.emailsSurveyed){
          var check = gr.emailsSurveyed.indexOf(userMail);

          if(check > -1){
            gr.emailsSurveyed.splice(check, 1);
            doUpdate = true;
          }
        }

        if(doUpdate){
          Group.update({_id:gr._id},
            {$set: gr},
            {});
        }
      });

      Connections.remove(
        {$or : [
          { "userId": currentUser._id},
          { "email": userMail}
          ] 
        },
        {});

      Feedback.remove(
        {$or : [
          { "from": currentUser._id},
          { "to": currentUser._id}
          ] 
        },
        {});

      Meteor.users.remove({_id:Meteor.userId()});
    }else{
      throw new Meteor.Error("unknown user");
    }
  },
})
