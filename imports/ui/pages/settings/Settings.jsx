import React from 'react';
import { Link } from 'react-router-dom';
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
                <Link to="/settings/name" className="summarytext">
                    <div className="fontreleway fontstatement cursor-pointer">
                        <div className="w-block summarytext">
                            {getUserName(this.props.currentUser.profile)}
                        </div>
                        <div className="w-block summarytext">change your name</div>
                    </div>
                </Link>
            </li>
            <li className="list-item">
                <Link to="/settings/email" className="summarytext">
                    <div className="fontreleway fontstatement cursor-pointer">
                        <div className="w-block summarytext">
                        {this.props.currentUser.emails && this.props.currentUser.emails[0].address}
                        </div>
                        <div className="w-block summarytext">change your email address</div>
                    </div>
                </Link>
            </li>
            <li className="list-item">
                <Link to="/settings/gender" className="summarytext">
                    <div className="fontreleway fontstatement cursor-pointer">
                        <div className="w-block summarytext">
                        {this.props.currentUser.profile.gender}
                        </div>
                        <div className="w-block summarytext">change your gender information</div>
                    </div>
                </Link>
            </li>
            <li className="list-item">
                <div className="summarytext">
                    <div className="fontreleway fontstatement cursor-pointer" onClick={()=>{
                        Session.set( "loggedOut", true);
                        Meteor.logout()
                        }}><u>LOG OUT</u></div>
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
  
  