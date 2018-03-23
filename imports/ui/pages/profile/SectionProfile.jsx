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
            <div className="fontreleway fonttitle">Let the games begin!</div>
            <p className="fontreleway titlepara">Discover WeQ, the system that uses proven scientific principles to build peak-perfoming teams.
              <br/>It's a perfect way to remove bias, promote group feedback, and build psychological safety in any team.
              <br/>Visit <a href="https://www.weq.io/">www.weq.io</a> to book your sesion today!</p>
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

