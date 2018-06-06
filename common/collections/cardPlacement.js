CardPlacement =  new Mongo.Collection('cardPlacement');

CardPlacementSchema = new SimpleSchema({
	"userId":{
		type: String,
		label: "userId",
	},
	"groupId":{
		type: String,
		label: "groupId",
	},
	"combinedRank":{
		type: Object,
		blackbox:true,
		label: "combinedRank",
	},
	"rankOrder":{
		type: [Object],
		blackbox:true,
		label: "rankOrder",
	},
	"cardPicked":{
		type: [Object],
		blackbox:true,
		label: "cardPicked",
		optional: true,
	},
	"createdAt": {
		type: Date,
		label: "Date group created",
		optional: true,
		autoValue: function() {
		  if ( this.isInsert || this.isUpsert ) {
			return new Date;
		  }
		}
	  },
	  "updatedAt": {
		type: Date,
		label: "Date group updated",
		optional: true , 
		autoValue: function() {
		  if ( this.isUpdate || this.isUpsert ) {
			return new Date;
		  }
		}
	  },
})

CardPlacement.attachSchema(CardPlacementSchema);