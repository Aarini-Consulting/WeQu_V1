var imageStore = new FS.Store.GridFS("profilePicture");
ProfilePicture= new FS.Collection("profilePicture", {
  stores: [imageStore],
  filter: {
   allow: {
    contentTypes: ['image/*'],
    extensions: ['jpeg','png','jpg','gif'],
  },
  onInvalid: function (message) {
   alert(message);
 }
}
})

if (Meteor.isClient) {
  Meteor.subscribe("ProfilePicture");
}

ProfilePicture.allow({
  'insert': function () {
   return true;
 },
 'update':function () {
   return true;
 },
 'remove': function () {
   return true;
 },
 download:function(){
  return true;
}
})