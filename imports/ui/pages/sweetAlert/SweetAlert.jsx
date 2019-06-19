import React from 'react';
import { Meteor } from 'meteor/meteor';

import Info from './Info';
import Confirm from './Confirm';
import ConfirmAdd from './ConfirmAdd';
import ConfirmEdit from './ConfirmEdit';
import ConfirmCloseCycle from './ConfirmCloseCycle';
import ConfirmReopenCycle from './ConfirmReopenCycle';
import PlayCardGrade from './PlayCardGrade';
import QuizSelectNameSelf from './QuizSelectNameSelf';

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
    else if(this.props.type == "play-card-grade"){
        return (
            <PlayCardGrade {...this.props}/>
        );
    }
    else if(this.props.type == "quiz-select-name-self"){
        return (
            <QuizSelectNameSelf {...this.props}/>
        );
    }
    else{
        console.log(this.props.type);
        return null;
    }
  }
}





