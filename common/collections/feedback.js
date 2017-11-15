Feedback =  new Mongo.Collection('feedback');

FeedbackSchema = new SimpleSchema({
    "from":{
    	type: String,
    	label: "from"
    },
    "to":{
    	type: String,
    	label: "to"
    },
    "qset":{
    	type: [Object],
    	label: "qset"
    },
    "done":{
    	type: Boolean,
    	label: "done"
    },
    "invite":{
    	type: Boolean,
    	label: "invite",
    	optional: true
    }

})

//Feedback.attachSchema(FeedbackSchema);

if (Meteor.isClient) {
    // Meteor.subscribe("feedback");
}