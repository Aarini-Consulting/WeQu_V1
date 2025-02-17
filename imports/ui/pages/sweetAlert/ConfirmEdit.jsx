import React from 'react';
import { Meteor } from 'meteor/meteor';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

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
            <div className="popup-container">
            <div className="sweet-overlay" tabIndex="-1" style={{opacity: 1.34, display: "block"}}></div>
            <div className="sweet-alert showSweetAlert visible" data-custom-classname="" data-has-cancel-button="false" data-has-confirm-button="true" data-allow-outside-click="false" data-has-done-function="true" data-animation="pop" data-timer="null" style={{display: 'block'}}>
                <div className="fontreleway f-popup-title">
                    <T>weq.confirmEdit.ConfirmTitle</T>
                </div>
                <div className="msg-wrapper">
                    {deleted.length > 0 &&
                        <div className="fontreleway f-popup-title f-popup-msg"><T count={deleted.length}>weq.confirmEdit.RemoveMember</T></div>
                    }

                    {added.length > 0 &&
                        <div>
                            <div className="fontreleway f-popup-title f-popup-msg"><T count={added.length}>weq.confirmEdit.AddNewMember</T></div>
                            <div className="fontreleway f-popup-title f-popup-msg"><T>weq.confirmEdit.EmailSendConfirmation</T></div>
                        </div>
                    }

                    {resend.length > 0 &&
                        <div className="fontreleway f-popup-title f-popup-msg"><T count={resend.length}>weq.confirmEdit.EmailReminderConfirmation</T></div>
                    }

                    {this.props.unsaved &&
                        <div className="fontreleway f-popup-title f-popup-msg"><T>weq.confirmEdit.UnsavedInput</T></div>
                    }

                    {this.props.groupName && this.props.groupName != this.props.newName &&
                        <div className="fontreleway f-popup-title f-popup-msg"><T>weq.confirmEdit.GroupNameChanged</T></div>
                    }

                    {((this.props.groupLanguage && this.props.groupLanguage != this.props.groupLanguageNew) || 
                    (!this.props.groupLanguage && this.props.groupLanguageNew)) &&
                        <div className="fontreleway f-popup-title f-popup-msg">Group language changed</div>
                    }
                </div>

                <div className="w-block align-center">
                    <div className="w-inline-block">
                        <div className="bttn-wrapper w-clearfix">
                            <div className="popup-bttn left" onClick={this.props.onCancel}>
                            <div className="fontreleway f-bttn"><T>weq.confirmEdit.Cancel</T></div>
                            </div>
                            <div className="popup-bttn right" onClick={this.props.onConfirm}>
                            <div className="fontreleway f-bttn"><T>weq.confirmEdit.Proceed</T></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div> 
        );
  }
}