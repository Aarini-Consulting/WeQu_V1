import React from 'react';
import { Meteor } from 'meteor/meteor';

import '/imports/startup/client/css/sweetalert';

import ConfirmAdd from './ConfirmAdd';
import ConfirmEdit from './ConfirmEdit';

export default class SweetAlert extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    if(this.props.type == "error" || this.props.type == "warning" || this.props.type == "info" || this.props.type == "success"){
        return (
            <div>
            <div className="sweet-overlay" tabIndex="-1" style={{opacity: 1.34, display: "block"}}></div>
            <div className="sweet-alert showSweetAlert visible" data-custom-classname="" data-has-cancel-button="false" data-has-confirm-button="true" data-allow-outside-click="false" data-has-done-function="true" data-animation="pop" data-timer="null" style={{display: 'block', marginTop: -167+ "px"}}>
                <div className="sa-icon sa-error" style={{display: "none"}}>
                  <span className="sa-x-mark">
                    <span className="sa-line sa-left"></span>
                    <span className="sa-line sa-right"></span>
                  </span>
                </div>
                <div className="sa-icon sa-warning" style={{display:'none'}}>
                    <span className="sa-body"></span>
                    <span className="sa-dot"></span>
                </div>
                <div className="sa-icon sa-info" style={{display:'block'}}></div>
                <div className="sa-icon sa-success" style={{display:'none'}}>
                    <span className="sa-line sa-tip"></span>
                    <span className="sa-line sa-long"></span>
    
                    <div className="sa-placeholder"></div>
                    <div className="sa-fix"></div>
                </div>
                <div className="sa-icon sa-custom" style={{display:'none'}}></div>
                <h2>test</h2>
                <p style={{display:'block'}}>hello world 3</p>
                <fieldset>
                    <input tabIndex="3" placeholder="" type="text"/>
                    <div className="sa-input-error"></div>
                </fieldset>
                <div className="sa-error-container">
                    <div className="icon">!</div>
                    <p>Not valid!</p>
                </div>
                <div className="sa-button-container">
                    <button className="cancel" tabIndex="2" style={{boxShadow:'none'}}
                    onClick={this.props.onCancel}
                    >Cancel</button>
                    <div className="sa-confirm-button-container">
                        <button className="confirm" tabIndex="1" className="swal-box-shadow"
                        style={{display:'inline-block',backgroundColor:'rgb(174, 222, 244)'}}
                        onClick={this.props.onConfirm}
                        >OK</button>
                        <div className="la-ball-fall">
                        <div></div>
                        <div></div>
                        <div></div>
                        </div>
                    </div>
                </div>
            </div>
            </div> 
          );
    }
    else if(this.props.type == "confirm-add"){
        return (
            <ConfirmAdd {...this.props}/>
        );
    }
    else if(this.props.type == "confirm-edit"){
        return (
            <ConfirmEdit {...this.props}/>
        );
    }
    else{
        console.log(this.props.type);
        return null;
    }
  }
}





