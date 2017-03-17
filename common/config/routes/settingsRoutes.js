  


  Router.route('/settings', function () {
        route.set("settings");
        this.layout('ApplicationLayout');

       return this.render('settings');

    }, { 'name': '/settings' });
