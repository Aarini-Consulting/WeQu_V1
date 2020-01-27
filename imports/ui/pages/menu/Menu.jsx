import React from 'react';
import { Link } from 'react-router-dom';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

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
                <a onClick={this.decideAction.bind(this,"/")} 
                className={"text fontreleway fontmenu _1 " + this.isCurrent("/")}>
                    <T>weq.Menu.Home</T>
                </a>
                {(Roles.userIsInRole( Meteor.userId(), 'GameMaster' ) || Roles.userIsInRole( Meteor.userId(), 'TrialGameMaster' )) &&
                    <a onClick={this.decideAction.bind(this,"/invite-group")} 
                    className={"text fontreleway fontmenu _2 " + this.isCurrent("/invite-group")}>
                       <T>weq.Menu.Groups</T>
                    </a>
                }
                {/* <a href="https://www.weq.io/shop"
                className={"text fontreleway fontmenu _3"}>
                    Shop
                </a> */}
                <a onClick={this.decideAction.bind(this,"/settings")} 
                className={"text fontreleway fontmenu _4 " + this.isCurrent("/settings")}>
                    <T>weq.Menu.Settings</T>
                </a>
            </div>
        );
    }
}