  


  Router.route('/settings', function () {
        route.set("settings");
        this.layout('ApplicationLayout');

       return this.render('settings');

    }, { 'name': '/settings' });
 
 Router.route('/scriptLoginAfterQuiz/:userId?', function () {

     this.layout('ApplicationLayout');

     return this.render('scriptLoginAfterQuiz');

 }, { 'name': '/scriptLoginAfterQuiz/:userId?' });


 Router.route('/terms', function () {
    this.layout('ApplicationLayout');

   return this.render('terms');

}, { 'name': 'terms' });
 