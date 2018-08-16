import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';


import Loading from '/imports/ui/pages/loading/Loading';
import AdminLogin from '/imports/ui/pages/AdminLogin';
import AdminGameMasterView from '/imports/ui/pages/AdminGameMasterView';
import AdminUserView from '/imports/ui/pages/AdminUserView';

class AdminUser extends React.Component {
    constructor(props){
        super(props);
        this.state={
          showGameMaster:false,
          searchQuery:""
        }
    }

    setShowGameMaster(bool, event){
        this.setState({
            showGameMaster: bool,
        });
    }

    handleChangeSearch(e) {
        this.setState({ searchQuery: e.target.value });
     }
  
    keyPressSearch(e){
        if(e.keyCode == 13){
            console.log(e.target.value);
            // put the login here
        }
    }

    handleClickSearch(){
        console.log(this.state.searchQuery);
    }
    
    
    render() {
        if(this.props.dataReady){
            if(Meteor.userId() && this.props.currentUser && this.props.currentUser.emails[0].address == "admin@wequ.co"){
                return (
                    <div className="fillHeight">
                      <div className="div-block-center">
                        <center> Welcome to the admin Dashboard </center>
                        <a href="#" id="logout"> 
                          <img className="lg-icon" src="/img/login_button_deactive.png" />
                        </a>
                      </div>
                      
                      <div className="tabs-menu w-tab-menu tap-underline gm">
                        <div className="gm-search">
                            <div className="gm-search-box">
                                <input type="text" name="fname" onKeyDown={this.keyPressSearch.bind(this)} onChange={this.handleChangeSearch.bind(this)}/>
                                <div className="gm-search-icon-container" onClick={this.handleClickSearch.bind(this)}>
                                <i className="fa fa-search" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>

                      <a className={"tap gm w-inline-block w-tab-link " + (this.state.showGameMaster==false && "w--current")} onClick={this.setShowGameMaster.bind(this,false)}>
                      <div>
                      All Users
                      </div>
                      </a>

                      <a className={"tap gm w-inline-block w-tab-link tap-last " + (this.state.showGameMaster==true && "w--current")} onClick={this.setShowGameMaster.bind(this,true)}>
                      <div>
                      GameMaster
                      </div>
                      </a>
                            {/* <div className="tab row">
                                <div className="col-md-4 col-sm-4 col-xs-4">
                                <button className={"tablinks " + (this.state.showGameMaster && "active2")} id="view1" onClick={this.setShowGameMaster.bind(this,false)}>
                                All Users
                                </button>
                                </div>
                                <div className="col-md-4 col-sm-4 col-xs-4">
                                <button className={"tablinks " + (!this.state.showGameMaster && "active2")} id="view2" onClick={this.setShowGameMaster.bind(this,true)}>
                                GameMaster
                                </button>
                                </div>
                                <div className="col-md-4 col-sm-4 col-xs-4"> </div>
                            </div> */}
                      </div>
          
                      <div className="tabs w-tabs">
                              {this.state.showGameMaster 
                              ?
                              <AdminGameMasterView/>
                              :
                              <AdminUserView/>
                              }
                      </div>
                      {/* <center>
                      <button><a href="/adminAccountCreation"> Create test account  </a> </button>
                      </center> */}
                  </div>
                );
            }else{
                return(
                    <AdminLogin/>
                )
                
            }
        }else{
            return(
                <Loading/>
              );
        }
    }
  }

export default withTracker((props) => {
    var dataReady;
    var listUsers;
    var handle = Meteor.subscribe('users',{}, {}, {
        onError: function (error) {
                console.log(error);
            }
		});


    if(handle.ready()){
        listUsers = Meteor.users.find().fetch();
        dataReady = true;
    }
    return {
        currentUser: Meteor.user(),
        listUsers: listUsers,
        dataReady:dataReady
    };
})(AdminUser);
  
  
  