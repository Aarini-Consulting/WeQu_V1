import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, Redirect } from 'react-router';

class ShareProfile extends React.Component {
  render() {
    return (
        <div className="sectiongreybg2">
            <div className="share-sectipn titlesection w-container"><img className="iconwrapper" src="/img/iconShare.png"/>
            <div className="fontreleway fonttitle">Share Your Skills Via</div>
            </div>

            <div>
            <div className="row-3 w-row">
                <div className="w-col w-col-4 w-col-medium-4 w-col-small-4 w-col-tiny-4">
                <a className="fb-xfbml-parse-ignore" target="_blank" href=""><img className="share-icon" src="/img/fb-art.png"/></a>
                </div>
                <div className="w-col w-col-4 w-col-medium-4 w-col-small-4 w-col-tiny-4">
                <a className="twitter-share-button" href="https://twitter.com/intent/tweet?text={{text.tex}}&original_referer=" target="_blank"
                    data-size="large"
                    data-text="{{text.tex}}"
                    data-url="{{text.url}}"
                    data-hashtags="example,demo"
                    data-via="twitterdev"
                    data-related="twitterapi,twitter">
                <img className="share-icon" sizes="(max-width: 479px) 45px, 50px" src="/img/twitter-logo-blue.png"/>
                </a>
                </div>
                
                <div className="w-col w-col-4 w-col-medium-4 w-col-small-4 w-col-tiny-4">
                <a href="https://www.linkedin.com/shareArticle?mini=true&url={{text.url}}&title={{text.linkTitle}}%20&summary={{text.linkSummary}}&source=Wequ"
                target="_blank">
                <img className="share-icon" sizes="(max-width: 479px) 45px, 50px" src="/img/linkedin-logo.png"/>
                </a>
                </div>
            </div>
            </div>

            <div id="fb-root"></div>
        </div>
    );
  }
}

export default withTracker((props) => {
  return {
      currentUser: Meteor.user()
  };
})(ShareProfile);

