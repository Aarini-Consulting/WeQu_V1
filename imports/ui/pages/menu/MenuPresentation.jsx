import React from 'react';
import { Link } from 'react-router-dom';

export default class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state={
          showMenu:false
        }
    }
    
    decideAction(path){
        var currentPath = this.props.location.pathname;
        if(path == currentPath){
            this.props.history.replace(path);
        }else if(currentPath.startsWith(path+"/") || path.startsWith(currentPath+"/")){
            this.props.history.push(path);
            window.location.reload();
        }else{
            this.props.history.push(path);
        }
    }

    toggleMenu(){
        this.setState({
            showMenu:!this.state.showMenu
        });
    }

    render() {
        return (
            <div className="div-block-center">
                <div className="menubar presentation w-clearfix">
                    <div className="screentitlebttn">
                        <a className="w-clearfix w-inline-block cursor-pointer menubar-bttn-white" onClick={()=>{
                        this.props.history.goBack();
                        }}>
                        <i className="fas fa-arrow-left"></i>
                        </a>
                    </div>
                    <div className="fontreleway font-invite-title white w-clearfix">
                    {this.props.groupName}
                    </div>
                    <div className="screentitlebttn">
                        <a className="w-clearfix w-inline-block cursor-pointer menubar-bttn-white" onClick={this.toggleMenu.bind(this)}>
                        <i className="fas fa-bars"></i>
                        </a>
                    </div>
                </div>
                {this.state.showMenu &&
                    <div className="hamburger-menu-open">
                        <div className="div-block-center" onClick={this.decideAction.bind(this,"/")}>
                            <div className="hamburger-menu-item">
                                Home
                            </div>
                        </div>
                        {Roles.userIsInRole( Meteor.userId(), 'GameMaster' ) &&
                            <div className="div-block-center" onClick={this.decideAction.bind(this,"/invite-group")}>
                                <div className="hamburger-menu-item">
                                    Groups
                                </div>
                            </div>
                        }
                        <div className="div-block-center" onClick={this.decideAction.bind(this,"/settings")}>
                            <div className="hamburger-menu-item">
                                Settings
                            </div>
                        </div>
                    </div>
                }
                
            </div>
        );
    }
}