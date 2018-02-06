import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Menu from '/imports/ui/pages/menu/Menu';

class QuizSummary extends React.Component {
  render() {
    return (
      <div className="fillHeight">
        <section className={"gradient"+(this.props.currentUser && this.props.currentUser.profile && this.props.currentUser.profile.gradient)+" whiteText alignCenter"}>
            <h2 style={{width:65+'%',marginLeft:"auto",marginRight:"auto"}}>
            Well done!<br/>
            <Link to="/quiz">Answer more question</Link>
            </h2>
            {/* <img src="/img/next.png" id="next" style={{width:60+'px', marginTop:30+'%'}}/> */}

            <h2 style={{width:65+'%',marginLeft:"auto",marginRight:"auto"}}>
            <Link to="/invite">Invite other people</Link>
            </h2>
            {/* <img src="/img/next.png" id="next" style={{width:60+'px', marginTop:30+'%'}}/> */}
        </section>
      </div>
    );
  }
}

export default withTracker((props) => {
  return {
      currentUser: Meteor.user()
  };
})(QuizSummary);
