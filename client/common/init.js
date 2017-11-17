Meteor.startup(function() {
        WebFontConfig = {
          google: { families: ["Raleway:100,200,300,regular,500,600,700,800,900"]}
        };
        (function() {
          var wf = document.createElement('script');
          wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
          wf.type = 'text/javascript';
          wf.async = 'true';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(wf, s);
         // console.log("async fonts loaded", WebFontConfig);
        })();   

        //FB Initialisation ..

        window.fbAsyncInit = function() {
          FB.init({
            appId            : '398393137218016',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v2.9'
          });
          FB.AppEvents.logPageView();
        };

        (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));

      sAlert.config({
        effect: 'genie',
        position: 'bottom',
        timeout: 5000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        // examples:
        // beep: '/beep.mp3'  // or you can pass an object:
        // beep: {
        //     info: '/beep-info.mp3',
        //     error: '/beep-error.mp3',
        //     success: '/beep-success.mp3',
        //     warning: '/beep-warning.mp3'
        // }
        onClose: _.noop //
        // examples:
        // onClose: function() {
        //     /* Code here will be executed once the alert closes. */
        // }
     }); 

    //   Accounts.ui.config({
    //     requestPermissions: {
    //         linkedin: ['r_basicprofile','w_share'],
    //     }
    // });  

});