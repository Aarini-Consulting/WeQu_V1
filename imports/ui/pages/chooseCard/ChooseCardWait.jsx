import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';
import Loading from '/imports/ui/pages/loading/Loading';
import SessionWait from '/imports/ui/pages/quizClient/SessionWait';

import ChooseCardSelf from './ChooseCardSelf';

class ChooseCardPage extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return(
            <SessionWait/>
        );
    }
}