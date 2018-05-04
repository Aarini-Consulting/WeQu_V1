import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Menu from '/imports/ui/pages/menu/Menu';
import Loading from '/imports/ui/pages/loading/Loading';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            showConfirmDelete:false,
            showDeleteInfoGameMaster:false
        }
    }

    showConfirmDelete(){
        this.setState({
            showConfirmDelete:true,
        })
    }

    deleteAccount(){
        this.setState({ showConfirmDelete: false });
        if(this.props.currentUser && this.props.currentUser.roles && this.props.currentUser.roles[0] == "GameMaster"){
            this.setState({
                showDeleteInfoGameMaster:true,
            })
        }else{
            Meteor.call( 'user.delete', ( error, response ) => {
                if ( error ) {
                    console.log(error);
                }else{
                    Session.set( "loggedOut", true);
                }
            });
        }
    }

    logout(){
        Session.set( "loggedOut", true);
        Meteor.logout()
    }

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
                    <div className="fontreleway fontstatement cursor-pointer" onClick={this.showConfirmDelete.bind(this)}>
                    <u>DELETE MY ACCOUNT/DATA</u></div>
                </div>
            </li>
            <li className="list-item">
                <div className="summarytext">
                    <div className="fontreleway fontstatement cursor-pointer" onClick={this.logout.bind(this)}>
                        <u>LOG OUT</u>
                    </div>
                </div>
            </li>
        </ul>
        {this.state.showConfirmDelete &&
            <SweetAlert
            type={"confirm"}
            message={"This action is not reversible, are you sure?"}
            confirmText={"Yes, Delete my account and data"}
            cancelText={"Cancel"}
            onCancel={() => {
                this.setState({ showConfirmDelete: false });
            }}
            onConfirm={() => {
                this.deleteAccount();
            }}/>
        }
        {this.state.showDeleteInfoGameMaster &&
            <SweetAlert
            type={"info"}
            message={"Please consult contact@weq.io for the removal of your account"}
            onCancel={() => {
                this.setState({ showDeleteInfoGameMaster: false });
            }}/>
        }
        
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
  
  