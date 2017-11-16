import React from 'react';
import { Link } from 'react-router-dom';

export default class MenuProfile extends React.Component {
  render() {
    return (
        <div>
            <div className="menuBar">
            <a href="/quiz"><img src="/img/back.png" style="width:18px;"/></a>
            <div><b>{username +" "+ profile}</b>
            </div>
            <div><img src="/img/back.png" style="width:18px; visibility: hidden"/>
            <a href="/settings"><img src="/img/icon_settings.png" style="width:18px;"/></a> 
            </div>
            </div>
            <div className="menuBar">
            {userId 
            ?
            <div>
            <a href="/profile/user/{{userId}}" className={route == 'profile' ? 't100' : 't50'}>Overview</a>
            <a href="/profile/skills/{{userId}}" className={route == 'skills' ? 't100' : 't50'}>Skills</a>
            </div>
            :
            <div>
            <a href="/profile" className={route == 'profile' ? 't100' : 't50'}>Overview</a>
            <a href="/profile/skills" className={route == 'skills' ? 't100' : 't50'}>Skills</a>
            {/* <a href="/profile/written-feedback" className="{{#if route 'feedback'}}t100{{else}}t50{{/if}}">Feedback</a> */}
            </div>
            }
            </div>
        </div>
    );
  }
}
