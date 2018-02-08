import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Menu from '/imports/ui/pages/menu/Menu';
import Loading from '/imports/ui/pages/loading/Loading';

class Settings extends React.Component {
    render() {
      return (
        <div className="fillHeight">
        <Menu location={this.props.location} history={this.props.history}/>
        {this.props.currentUser 
        ?
        <section>
        <ul className="w-list-unstyled">
            <li className="list-item">
            <div className="summarytext">
                <div className="fontreleway fontstatement">{getUserName(this.props.currentUser.profile)}</div>
            </div>
            </li>
            <li className="list-item">
            <div className="summarytext">
                <div className="fontreleway fontstatement">
                {this.props.currentUser.emails && this.props.currentUser.emails[0].address}
                </div>
            </div>
            </li>
            <li className="list-item">
            <div className="summarytext">
                <div className="fontreleway fontstatement">{this.props.currentUser.profile.gender}</div>
            </div>
            </li>
            <li className="list-item">
            <div className="summarytext">
                <div className="fontreleway fontstatement" onClick={()=>{
                    Session.set( "loggedOut", true);
                    Meteor.logout()
                    }}>LOG OUT</div>
            </div>
            </li>
        </ul>
        </section>
        :
        <Loading/>
        }
        
        </div>
      );
    }
  }

  export default withTracker((props) => {
    return {
        currentUser: Meteor.user(),
    };
  })(Settings);
  
  