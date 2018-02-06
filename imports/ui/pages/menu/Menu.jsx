import React from 'react';
import { Link } from 'react-router-dom';

export default class Menu extends React.Component {
  render() {
    var pathname = this.props.location.pathname;
    return (
        <div className="menubar w-clearfix">
            <Link to="/quiz" className="text fontreleway fontmenu">quiz</Link>
            {Roles.userIsInRole( Meteor.userId(), 'GameMaster' )
            ? 
                <div className="text fontreleway fontmenu _2 dd-contact">
                    contact
                    <span className="dropdown-arrow"></span>
                    <div className="dd-contact-box">
                        <Link to="/invite" className="text fontreleway fontmenu fdropdown w-dropdown-link">personal</Link>
                        <Link to="/invite-group" href="#" className="text fontreleway fontmenu fdropdown w-dropdown-link">Group</Link>
                    </div>
                </div>
            :
                <Link to="/invite" className="text fontreleway fontmenu _2">
                    contact
                </Link>
            }

            <Link to="/profile" className="text fontreleway fontmenu _3">profile</Link>
            <Link to="/settings" className="text fontreleway fontmenu _4">
                    settings
            </Link>
        </div>
        // <div className="menuBar">
        //     <Link to="/quiz" className={pathname == '/quiz' ? 't100' : 't50'} id="quiz">
        //     <img src="/img/icon_vote.png"/>
        //     </Link>
        //     {Roles.userIsInRole( Meteor.userId(), 'GameMaster' )
        //     ? 
        //         pathname == '/invite-group' 
        //         ?
        //             <Link to="/invite" className={pathname == '/invite-group' ? 't100' : 't50'} id="changeView">
        //             <img className="width30" src="/img/gameMaster/icon_contact_2.png"/>
        //             </Link>
        //         :
        //             <Link to={pathname == '/invite' ? '/invite-group' : '/invite'} className={pathname == '/invite' ? 't100' : 't50'} id="changeView">
        //             <img className="width30" src="/img/gameMaster/icon_contact_1.png"/>
        //             </Link>
                    
        //     :
        //         <Link to="/invite" className={pathname == '/invite' ? 't100' : 't50'}>
        //         <img src="/img/icon_invite.png"/>
        //         </Link>
                
        //     }
        //     <Link to="/profile" className={pathname == 'profile' ? 't100' : 't50'}>
        //         <img src="/img/icon_profile.png"/>
        //     </Link>
        //     {/* <a href="#" id="logout" className="{{#if loggedIn}}hidden{{/if}}"> <img className="lg-icon" src="/img/login_button_deactive.png"/></a>
        //     <a href="/admin">A</a> */}
        // </div>
    );
  }
}