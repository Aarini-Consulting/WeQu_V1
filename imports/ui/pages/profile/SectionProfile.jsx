import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, Redirect } from 'react-router';

class SectionProfile extends React.Component {
  render() {
    return (
        <div class="sectionprofile">
          <div class="titlesection w-container"><img class="iconplay iconwrapper" src="/img/iconPlay2.png"/>
            <div class="fontreleway fonttitle">WeQu Team Feedback Game</div>
            <p class="fontreleway titlepara">Discover WeQu games, crafted for team feedback experience.
              <br/>It's a perfect way to break the ice and kickstart an open dialogue in any team.
              <br/>Get your own game today and join the community!</p>
            </div>
            <div class="instagramdiv">
              <div class="html-embed w-embed w-iframe w-script">
                {/* SnapWidget */}
                <script src="https://snapwidget.com/js/snapwidget.js"></script>
                <iframe src="https://snapwidget.com/embed/379943" class="snapwidget-widget" allowtransparency="true" frameborder="0" scrolling="no" style="border:none; overflow:hidden; width:100%; "></iframe>
              </div><a class="buybttn fontbttn profilebttn w-button" href="https://www.wequ.co/">buy wequ games</a>
            </div>
        </div>
    );
  }
}

export default withTracker((props) => {
  return {
      currentUser: Meteor.user()
  };
})(SectionProfile);

