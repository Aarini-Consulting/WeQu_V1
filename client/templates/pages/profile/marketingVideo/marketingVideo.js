    
Template.marketingVideo.onRendered(function() {

   var onPlayerReady = function(event) {
     // event.target.playVideo();  
    };
      
   setTimeout(function(){
      onYouTubeIframeAPIReady();
   }, 1000)

    // The first argument of YT.Player is an HTML element ID. YouTube API will replace my <div id="player"> tag with an iframe containing the youtube video.
    var player;
    function onYouTubeIframeAPIReady() {
    var player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId : 'RwvjDSWh-So',
        events : {
            'onReady' : onPlayerReady
        }
     });
  }


});