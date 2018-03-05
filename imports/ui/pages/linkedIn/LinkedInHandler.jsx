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
          loading:true,
          success:false
        }
    }

    componentWillMount(){
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

        if(params.code){
            var redirect_ui =  Meteor.absoluteUrl() + this.props.location.pathname.toString().substr(1);
            Meteor.call('get.access.token', redirect_ui, params.code, (error, result) => {
              if (error){
              console.log(error);
              }
              else if(result) {
               if(result.data && result.data.access_token){
                var extraFields = 'first-name,last-name,headline,location,summary,public-profile-url,positions,industry,picture-url,picture-urls::(original)';
                Meteor.call('get.linkedIn.data', result.data.access_token, extraFields, (error, result) => {
                  if (error){
                  console.log(error);
                  this.setState({
                        loading: false,
                        success:false
                    });
                  }
                  else if(result) {
                    this.setState({
                        loading: false,
                        success:true
                    });
                  }else{
                    this.setState({
                        loading: false,
                        success:false
                    }); 
                  }
                });
               }
              }
            });
        }
    }
    
    render() {
        if(this.state.loading){
            return (
                <div className="loginwraper">
                    <Loading/>
                </div>
            );
        }else{
            return(
                <Redirect to="/profile"/>
            );
        }
    }
  }
  
  