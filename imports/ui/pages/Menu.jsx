import React from 'react';
import { Link } from 'react-router';

export default class Menu extends React.Component {
  render() {
    return (
        <div className="menuBar">
            <a href="/quiz" className="{{#if route 'quiz'}}t100{{else}}t50{{/if}}" id="quiz">
            <img src="/img/icon_vote.png"/>
            </a>
            {isInRole == 'GameMaster'
            ? 
                normalView 
                ?
                    <a href="/invite" className="{{#if route 'invite'}}t100{{else}}t50{{/if}}" id="changeView" >
                    <img className="width30" src="/img/gameMaster/icon_contact_2.png"/>
                    </a>
                :
                    <a href="/invite" className="{{#if route 'invite'}}t100{{else}}t50{{/if}}" id="changeView" >
                    <img className="width30" src="/img/gameMaster/icon_contact_1.png"/>
                    </a>
            :
                <a href="/invite" className="{{#if route 'invite'}}t100{{else}}t50{{/if}}">
                <img src="/img/icon_invite.png"/>
                </a>
            }

            <a href="/feed" className="{{#if route 'feed'}}t100{{else}}t50{{/if}}"><img src="/img/icon_feed.png"/></a>
            <a href="/profile" className="{{#if route 'profile'}}t100{{else}}t50{{/if}}"><img src="/img/icon_profile.png"/></a>
            {/* <a href="#" id="logout" className="{{#if loggedIn}}hidden{{/if}}"> <img className="lg-icon" src="/img/login_button_deactive.png"/></a>
            <a href="/admin">A</a> */}
        </div>
    );
  }
}
