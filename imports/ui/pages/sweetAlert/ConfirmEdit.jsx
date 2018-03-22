import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class ConfirmEdit extends React.Component {

  constructor(props) {
    super(props);
  }

  inviteDeleted(){
    return this.props.inviteDeleted.filter((dataDeleted) => {
         return !this.props.newInviteDatas.find((inviteData)=>{
            return inviteData.email == dataDeleted.email
         })
    });
  }

  inviteAdded(){
    return this.props.newInviteDatas.filter((inviteData) => {
        return !this.props.inviteDeleted.find((dataDeleted)=>{
           return inviteData.email == dataDeleted.email
        })
   });
  }

  inviteResend(){
    return this.props.inviteResend.filter((resend) => {
        var deletedIndex = this.props.inviteDeleted.findIndex((deleted)=>{
            return resend.email == deleted.email
        })
        if(deletedIndex > -1){
            return false;
        }else{
            var newIndex = this.props.newInviteDatas.findIndex((newData)=>{
                return resend.email == newData.email
            })
            
            if(newIndex > -1){
                return false;
            }else{
                return true;
            }
        }
   });
  }

  render() {
       var deleted = this.inviteDeleted();
       var added = this.inviteAdded();
       var resend = this.inviteResend();
        return (
            <div>
            <div className="sweet-overlay" tabIndex="-1" style={{opacity: 1.34, display: "block"}}></div>
            <div className="sweet-alert showSweetAlert visible" data-custom-classname="" data-has-cancel-button="false" data-has-confirm-button="true" data-allow-outside-click="false" data-has-done-function="true" data-animation="pop" data-timer="null" style={{display: 'block', marginTop: -16.5+ "em"}}>
                <div className="fontreleway f-popup-title">The following actions need your confirmation</div>
                <div className="msg-wrapper">
                    {deleted.length > 0 &&
                        <div className="fontreleway f-popup-title f-popup-msg">Removed {deleted.length} member</div>
                    }

                    {added.length > 0 &&
                        <div className="fontreleway f-popup-title f-popup-msg">Added {added.length} member</div>
                    }

                    {resend.length > 0 &&
                        <div className="fontreleway f-popup-title f-popup-msg">Send reminder to {resend.length} member</div>
                    }

                    {this.props.unsaved &&
                        <div className="fontreleway f-popup-title f-popup-msg">unsaved input detected</div>
                    }

                    {this.props.groupName && this.props.groupName != this.props.newName &&
                        <div className="fontreleway f-popup-title f-popup-msg">Changed group name</div>
                    }
                </div>

                <div className="bttn-wrapper w-clearfix">
                    <div className="popup-bttn left" onClick={this.props.onCancel}>
                        <div className="fontreleway f-bttn">Go Back</div>
                    </div>
                    <div className="popup-bttn right" onClick={this.props.onConfirm}>
                        <div className="fontreleway f-bttn">Proceed</div>
                    </div>
                </div>
            </div>
            </div> 
        );
  }
}