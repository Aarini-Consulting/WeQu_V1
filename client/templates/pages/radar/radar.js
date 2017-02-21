Template.radar.onCreated(function(){

	  var self = this;
	  self.autorun(function() {
	    self.subscribe("feedback");
	  });

	   if(this.data.score){
       	this.data.points = dataForRadar(this.data.score);
       }
})