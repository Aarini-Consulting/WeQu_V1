import React from 'react';
import { Link } from 'react-router-dom';

export default class Menu extends React.Component {
  render() {
    var pathname = this.props.location.pathname;
    return (
        <div className="menuBar">
            <Link to="/quiz" className={pathname == '/quiz' ? 't100' : 't50'} id="quiz">
            <img src="/img/icon_vote.png"/>
            </Link>
            {Roles.userIsInRole( Meteor.userId(), 'GameMaster' )
            ? 
                pathname == '/invite-group' 
                ?
                    <Link to="/invite" className={pathname == '/invite-group' ? 't100' : 't50'} id="changeView">
                    <img className="width30" src="/img/gameMaster/icon_contact_2.png"/>
                    </Link>
                :
                    <Link to={pathname == '/invite' ? '/invite-group' : '/invite'} className={pathname == '/invite' ? 't100' : 't50'} id="changeView">
                    <img className="width30" src="/img/gameMaster/icon_contact_1.png"/>
                    </Link>
                    
            :
                <Link to="/invite" className={pathname == '/invite' ? 't100' : 't50'}>
                <img src="/img/icon_invite.png"/>
                </Link>
                
            }
            <Link to="/profile" className={pathname == 'profile' ? 't100' : 't50'}>
                <img src="/img/icon_profile.png"/>
            </Link>
            {/* <a href="#" id="logout" className="{{#if loggedIn}}hidden{{/if}}"> <img className="lg-icon" src="/img/login_button_deactive.png"/></a>
            <a href="/admin">A</a> */}
        </div>
    );
  }
}