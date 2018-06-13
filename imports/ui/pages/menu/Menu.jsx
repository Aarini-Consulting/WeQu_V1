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
        console.log(window.location.hostname);
        return (
            <div className="menubar w-clearfix">
                <a onClick={this.decideAction.bind(this,"/")} 
                className={"text fontreleway fontmenu _1 " + this.isCurrent("/")}>
                    home
                </a>
                {Roles.userIsInRole( Meteor.userId(), 'GameMaster' ) &&
                    <a onClick={this.decideAction.bind(this,"/invite-group")} 
                    className={"text fontreleway fontmenu _2 " + this.isCurrent("/invite-group")}>
                        groups
                    </a>
                }
                <a onClick={this.decideAction.bind(this,"/settings")} 
                className={"text fontreleway fontmenu _4 " + this.isCurrent("/settings")}>
                    settings
                </a>
            </div>
        );
    }
}