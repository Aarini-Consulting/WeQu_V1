import React from 'react';
import { Link } from 'react-router-dom';

export default class Menu extends React.Component {
    isCurrent(path){
        var currentPath = this.props.location.pathname;
        if(path == currentPath || (currentPath.startsWith(path+"/") || path.startsWith(currentPath+"/"))){
            return "active"; 
        }else{
            return "";
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

    render() {
        return (
            <div className="menubar w-clearfix">
                <a onClick={this.decideAction.bind(this,"/quiz")} 
                className={"text fontreleway fontmenu " + this.isCurrent("/quiz")}>quiz</a>
                {Roles.userIsInRole( Meteor.userId(), 'GameMaster' )
                ? 
                    <div className={"text fontreleway fontmenu _2 "+ this.isCurrent("/invite") + this.isCurrent("/invite-group") +" dd-contact"}>
                        contact
                        <span className="dropdown-arrow"></span>
                        <div className="dd-contact-box">
                            <a onClick={this.decideAction.bind(this,"/invite")} className="text fontreleway fontmenu fdropdown w-dropdown-a">personal</a>
                            <a onClick={this.decideAction.bind(this,"/invite-group")} className="text fontreleway fontmenu fdropdown w-dropdown-a">Group</a>
                        </div>
                    </div>
                :
                    <a onClick={this.decideAction.bind(this,"/invite")} 
                    className={"text fontreleway fontmenu _2 " + this.isCurrent("/invite")}>
                        contact
                    </a>
                }

                <a onClick={this.decideAction.bind(this,"/profile")} 
                className={"text fontreleway fontmenu _3 " + this.isCurrent("/profile")}>
                    profile
                </a>
                
                <a onClick={this.decideAction.bind(this,"/settings")} 
                className={"text fontreleway fontmenu _4 " + this.isCurrent("/settings")}>
                        settings
                </a>
            </div>
        );
    }
}