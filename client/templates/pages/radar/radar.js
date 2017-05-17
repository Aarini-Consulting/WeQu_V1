Template.radar.onCreated(function(){

	  var self = this;
	  self.autorun(function() {
	    self.subscribe("feedback");
	  });
})

Template.radar.helpers({
	points: function () {
		let score = Template.instance().data.score;
		if(score){
			points = dataForRadar(score);
			return points;
		}	
		return null
	
	}
});
