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
            showDeleteInfoGameMaster:false,
            consentSubs:false
        }
    }

    toggleConsent (e) {
        this.setState({
            [e.target.name]: e.target.checked,
        });
        Meteor.call('updateConsent', e.target.checked);
    }

    componentWillMount(){
        this.setDefaultValue(this.props);
    }
    
    componentWillReceiveProps(nextProps){
        this.setDefaultValue(nextProps);  
    }

    setDefaultValue(props){
        if(props.dataReady && props.currentUser && props.currentUser.profile && props.currentUser.profile.consentSubs){
            this.setState({
                consentSubs: props.currentUser.profile.consentSubs.consentGiven,
            });
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
                    Meteor.logout();
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
                        <div className="w-block summarytext-sub">change your name</div>
                    </div>
                </Link>
            </li>
            <li className="list-item">
                <Link to="/settings/email" className="summarytext">
                    <div className="fontreleway fontstatement cursor-pointer">
                        <div className="w-block summarytext">
                        {this.props.currentUser.emails && this.props.currentUser.emails[0].address}
                        </div>
                        <div className="w-block summarytext-sub">change your email address</div>
                    </div>
                </Link>
            </li>
            {/* <li className="list-item">
                <Link to="/settings/gender" className="summarytext">
                    <div className="fontreleway fontstatement cursor-pointer">
                        <div className="w-block summarytext">
                        {this.props.currentUser.profile.gender}
                        </div>
                        <div className="w-block summarytext-sub">change your gender information</div>
                    </div>
                </Link>
            </li> */}
            <li className="list-item">
                <div className="summarytext">
                    <div className="fontreleway fontstatement">
                            <input type="checkbox" ref="consentSubs" name="consentSubs"
                            checked={this.state.consentSubs}
                            onChange={this.toggleConsent.bind(this)}/>&nbsp; 
                            I would like to receive team-boosting related information, offers, recommendations and updates from WeQ
                    </div>
                </div>
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
    var dataReady = false;
    var currentUser = Meteor.user();

    if(Meteor.userId() && currentUser){
        dataReady = true;
    }else{
        dataReady = true;
    }
    return {
        dataReady: dataReady,
        currentUser: currentUser,
    };
  })(Settings);
  
  