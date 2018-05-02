import React from 'react';
import { Meteor } from 'meteor/meteor';

import '/imports/startup/client/css/sweetalert';

import Info from './Info';
import Confirm from './Confirm';
import ConfirmAdd from './ConfirmAdd';
import ConfirmEdit from './ConfirmEdit';
import ConfirmCloseCycle from './ConfirmCloseCycle';
import ConfirmReopenCycle from './ConfirmReopenCycle';

export default class SweetAlert extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    if(this.props.type == "info"){
        return(
            <Info {...this.props}/>
        )
    }
    else if(this.props.type == "confirm"){
        return (
            <Confirm {...this.props}/>
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
    else if(this.props.type == "confirm-close-cycle"){
        return (
            <ConfirmCloseCycle {...this.props}/>
        );
    }
    else if(this.props.type == "confirm-reopen-cycle"){
        return (
            <ConfirmReopenCycle {...this.props}/>
        );
    }
    else{
        console.log(this.props.type);
        return null;
    }
  }
}





