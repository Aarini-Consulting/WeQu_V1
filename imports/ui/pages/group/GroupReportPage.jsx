import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Report from '/imports/ui/pages/group/Report';

class GroupReportPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
          loading:"false"
        }
    }
    render() {
        return (
            <div className="tap-content-wrapper">
            <Report/>
            </div>
        );
    }
}

export default withTracker((props) => {
    var dataReady;
    return {
        dataReady:dataReady
    };
  })(GroupReportPage);