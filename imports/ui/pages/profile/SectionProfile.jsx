import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

class SectionProfile extends React.Component {
  onFrameLoad(){
    var iframe = ReactDOM.findDOMNode(this.refs.iframe);
    if(iframe){
        iframe.height = (iframe.offsetWidth + 5) + "px";
      }
  }
  render() {
    return (
        <div className="sectionprofile">
          <div className="titlesection w-container"><img className="iconplay iconwrapper" src="/img/iconPlay2.png"/>
            <div className="fontreleway fonttitle">WeQ Team Feedback Game</div>
            <p className="fontreleway titlepara">Discover WeQ games, crafted for team feedback experience.
              <br/>It's a perfect way to break the ice and kickstart an open dialogue in any team.
              <br/>Get your own game today and join the community!</p>
            </div>
            <div className="instagramdiv">
              <div className="html-embed w-embed w-iframe w-script">
                {/* SnapWidget */}
                <script src="https://snapwidget.com/js/snapwidget.js"></script>
                <iframe src="https://snapwidget.com/embed/379943" className="snapwidget-widget" allowtransparency="true" frameBorder="0" scrolling="no" 
                style={{border:"none", overflow:"hidden", width:100+ "%"}} 
                onLoad={this.onFrameLoad.bind(this)}
                ref="iframe"></iframe>
              </div>
              <a className="buybttn fontbttn profilebttn w-button" href="https://www.weq.io/">Supercharge your team</a>
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

