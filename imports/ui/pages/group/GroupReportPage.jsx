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
            <div>
                <div className="user-name">
                    <a href="#" className="menu-name w-inline-block">
                    <div className="report-name">All</div>
                    </a>
                    <a href="#" className="menu-name w-inline-block">
                    <div className="report-name">Niels Pas</div>
                    </a>
                    <a href="#" className="menu-name w-inline-block">
                    <div className="report-name">Yohandi Yajaja</div>
                    </a>
                    <a href="#" className="menu-name w-inline-block">
                    <div className="report-name">Oh Ko</div>
                    </a>
                    <a href="#" className="menu-name w-inline-block">
                    <div className="report-name">Scott Kennedy</div>
                    </a>
                    <a href="#" className="menu-name w-inline-block">
                    <div className="report-name">Jamie Oliver</div>
                    </a>
                    <a href="#" className="menu-name w-inline-block">
                    <div className="report-name">Niels Passsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</div>
                    </a>
                    <a href="#" className="menu-name w-inline-block">
                    <div className="report-name">Niels Pas</div>
                    </a>
                    <a href="#" className="menu-name w-inline-block">
                    <div className="report-name">Niels Pas</div>
                    </a>
                    <a href="#" className="menu-name w-inline-block">
                    <div className="report-name">Niels Pas</div>
                    </a>
                </div>
                <div className="report-content">
                    <div className="report-active">
                    <div className="container-2 w-container">
                        <div className="a4"></div>
                        <a href="#" className="pdf-download-bttn w-inline-block w-clearfix">
                        <div className="text-block-3">Download Individual Report</div>
                        </a>
                    </div>
                    </div>
                </div>
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