import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Loading2 from '/imports/ui/pages/loading/Loading2';

class Strength extends React.Component {
  constructor(props){
    super(props);
    this.state={
      toggleText:[],
    }
  }

  toggleText(skill, event){
    event.preventDefault();

    var temp = this.state.toggleText.slice();
    var index = temp.indexOf(skill);
    if(index > -1){
      temp.splice(index, 1);
    }else{
      temp.push(skill);
    }

    if(temp.length != this.state.toggleText.length){
      this.setState({
        toggleText: temp,
      });
    }
  }

  renderSkills(skillData){
    return skillData.map((data) => {
      return (
        <div className="skillcolumn w-col w-col-4 w-col-medium-4 w-col-small-small-stack w-col-tiny-tiny-stack" data-ix="skillls" key={"skill-highlight-"+data.skill}>
         <div className="skillblock"  onClick={this.toggleText.bind(this, data.skill)}>
           
          {(this.state.toggleText.indexOf(data.skill) > -1)
          ?
            <div className="swapDescription2 swap2{{skill}}" data-skill={data.skill} style={{color: data.color}} > 
                <div className="fontreleway skillname" style={{color: data.color}}> <b> {data.description} </b> </div>
            </div>
          :
            <img className="iconskill swapDescription1 swap1{{skill}} active" data-skill={data.skill} src={"/img/skills/"+data.skill+".png"}/>
          }
          <div className="fontreleway skillname">{data.text}</div>
         </div>
       </div>
      );
    });

  }

  render() {
    if(this.props.dataReady){
      console.log(this.props.userType);
      return (
        <div className="sectiongreybg sectionprofile">
        {this.props.data && this.props.data.top3 && this.props.data.weak3
        && this.props.data.top3.length > 0 && this.props.data.weak3.length > 0 
          ?
          <div>
            <div className="titlesection w-container"><img className="iconwrapper" src="/img/iconSkills.png"/>
            <div className="fontreleway fonttitle">{this.props.userType} MORE TRUE Skills</div>
            </div>

            <div className="columtop w-row">
            {this.renderSkills(this.props.data.top3)}
            </div>

            <div className="fontreleway fonttitle">{this.props.userType} LESS TRUE Skills</div>

            <div className="columtop w-row">
            {this.renderSkills(this.props.data.weak3)}
            </div>

            <p className="fontreleway paratopskills">These skills are selected based on the questions you and your teammates have answered about you.
            <br/>The more questions you answered, the more accurate your profile becomes.
            </p>
          </div>
          :
          <div className="sectiongreybg sectionprofile font-tile font-title-title font18">
              <center> There is no information about {this.props.userType} </center>
          </div>
        }
      
           

            <div className="sectionprofile sectiongreybg paddingTopInverse45" id="outer">
            <Link className="fontbttn profilebttn w-button" id="specificUser" to={"/quiz/" + (this.props.quizPerson != Meteor.userId() && this.props.quizPerson)}>
            
            {this.props.quizPerson == Meteor.userId()
            ? "Answer more questions about " + this.props.userType2
            : "Answer more question about " + this.props.userType
            }
            </Link>
            </div>
        </div>
      );
    }
    else{
      return(
        <Loading2/>
      );
    }
  }
}

export default withTracker((props) => {
  var dataReady;
  var userType;
  var userType2;
  var data;
  var handle = Meteor.subscribe('feedback', {
      onError: function (error) {
              console.log(error);
          }
      });
 

  if(Meteor.user() && handle.ready()){
    data = calculateTopWeak(Feedback.find({to: props.quizPerson }).fetch());

    if(props.quizPerson == Meteor.userId())
    {
      userType = "My"; 
      userType2 = "Myself"
    }
    else
      {
        let user = Meteor.users.findOne({_id: props.quizPerson});
        if(user){
          userType = getUserName(user.profile);
          userType2 = userType;
        }
      }
    dataReady = true;
  }
  return {
    data:data,
    userType:userType,
    userType2:userType2,
    dataReady:dataReady
  };
})(Strength);

