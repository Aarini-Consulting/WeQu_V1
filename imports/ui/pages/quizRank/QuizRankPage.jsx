import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import Loading from '/imports/ui/pages/loading/Loading';
import QuizRankPlaceCards from '/imports/ui/pages/quizRank/QuizRankPlaceCards';
import QuizRankSelf from './QuizRankSelf';
import QuizRankWait from './QuizRankWait';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class QuizRankPage extends React.Component {
    constructor(props){
        super(props);
    }
    
    render() {
        var user = this.props.user;
        let group = this.props.group;
        let selfRankCompleted = group.userIdsSelfRankCompleted && group.userIdsSelfRankCompleted.indexOf(user._id) > -1;
        if(selfRankCompleted){
            if(group.isPlaceCardFinished){
                return(
                    <QuizRankPlaceCards user={user} group={group}/>
                );
            }
            else{
                return(
                    <QuizRankWait user={user} group={group}/>
                );
            }
        }else{
            return (
                <QuizRankSelf user={user} group={group}/>
            );
        }
    }
}