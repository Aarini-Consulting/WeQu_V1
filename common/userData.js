

// For Debugging purpose

if (Meteor.isServer) {
	Meteor.publish("allUserData", function () {
		//return Meteor.users.find({}, {fields: {'nested.things': 1}});
		return Meteor.users.find({});
	});
}


if(Meteor.isDevelopment) {
	if (Meteor.isClient) {
		Meteor.subscribe("allUserData");
	}
}