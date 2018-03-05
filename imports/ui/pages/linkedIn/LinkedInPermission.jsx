import React from 'react';
import { Meteor } from 'meteor/meteor';

import Loading from '/imports/ui/pages/loading/Loading';

export default class LinkedInPermission extends React.Component {
    
    render() {
        if(!Session.get("csrf")){
            Session.set( "csrf", Random.secret());
        }
        var redirect_uri = Meteor.absoluteUrl() + this.props.match.params.redirect_pathname;
        var params =`?response_type=code&client_id=${Meteor.settings.public.LinkedInClientId}&redirect_uri=${redirect_uri}&state=${Session.get("csrf")}`;

        window.location = 'https://www.linkedin.com/oauth/v2/authorization'+params;
        return (
            <div className="loginwraper">
                <Loading/>
            </div>
        );
    }
  }
  
  