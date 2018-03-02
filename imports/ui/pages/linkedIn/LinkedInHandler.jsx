import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router';

import Loading from '/imports/ui/pages/loading/Loading';

import NotAuthorized from '/imports/ui/pages/NotAuthorized';


export default class LinkedInHandler extends React.Component {
    constructor(props){
        super(props);
        this.state={
          csrfCheck:true,
        }
    }

    componentWillMount(){
        console.log(this.props.location);

        var split = this.props.location.search.split("&");
        var params={};

        split.forEach((element, index) => {
            var keyValue;
            if(index == 0){
                keyValue = element.substr(1).split("=");
            }else{
                keyValue = element.split("=");
            }
            params[keyValue[0]] = keyValue[1];
        });

        console.log(params);

        if(params.code){
            var redirect_ui =  Meteor.absoluteUrl() + this.props.location.pathname.toString().substr(1);
            Meteor.call('get.access.token', redirect_ui, params.code, (error, result) => {
              if (error){
              console.log(error);
              }
              else if(result) {
               console.log(result)
              }
            });
        }else if(params.access_token){
            var extraFields = 'positions,industry,picture-urls::(original)';
            Meteor.call('get.linkedIn.data', params.access_token, extraFields, (error, result) => {
              if (error){
              console.log(error);
              }
              else if(result) {
               console.log(result)
              }
            });
        }
    }
    
    render() {
        return (
            <div className="loginwraper">
                <Loading/>
            </div>
        );
        
    }
  }
  
  