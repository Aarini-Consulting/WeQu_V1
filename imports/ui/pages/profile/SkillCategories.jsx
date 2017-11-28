import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link, Redirect } from 'react-router';

import Loading2 from '/imports/ui/pages/loading/Loading2';

class SkillCategories extends React.Component {
  constructor(props){
      super(props);
      this.state={
        expand:false,
        data:undefined
      }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.user)
    {
        let userId = nextProps.user._id;
        var data = { userId:userId, profile : nextProps.user.profile };

        var joinedQset = nextProps.feedbacks.map((fb, index)=>{
            return fb.qset;
        })
        

        var validAnswers = joinedQset.filter((q, index)=>{
            return question.answer;
        })

        var otherscore = calculateScore(joinedQset, true);
        data.enoughData = (validAnswers.length > 9);

        var i=0;
        let categories = {};
        categories = _.map(_.keys(framework), function(category) {
                return {
                    name : i18n[category],
                    category : category,
                    skills : _.map(framework[category], function(skill){
                        var data = {name : i18n[skill], value: 0, scored: otherscore.scored[skill], total: otherscore.total[skill], skill: skill, category: category }
                        if(otherscore.total[skill] > 0) {
                            data.value = Math.round(otherscore.scored[skill] * 100 / otherscore.total[skill]);
                        }
                        return data;
                    })
                }
        });
        data.categories = categories;
        this.setState({
            data:data
        });
        }
    }

    renderSkills(skills){
        return skills.map((skill) => {
            return (
                <div className="skillElement" id={skill.category + " " +skill.name}>
                    <div className="title">{skill.name}</div>
                    <div className="underBar" style={{width:60+"%"}}>
                    <div className={"bar "+skill.category} style={{width:skill.value + "%"}}></div>
                    </div>
                    <div className="score">{(skill.scored/skill.total)}</div>
                </div>
            );
          });
    }

    renderCategories(){
        if(this.state.data && this.state.data.categories){
            var categories = this.state.categories
            if(this.state.expand){
                categories = this.state.categories.splice(0,6);
            }

            return categories.map((cat) => {
                return (
                    <div id={"skillset "+cat.name}>
                        {this.renderSkills(cat.skills)}
                    </div>
                );
              });
        }
    }
        
    expand(event){
        event.preventDefault();
        if(this.state.expand){
            this.setState({
                expand:false
            });
        }else{
            window.scrollTo(0, (ReactDOM.findDOMNode(this.refs.sectionSkills).getBoundingClientRect().bottom));
            this.setState({
                expand:true
            });
        }
    }

    render() {
    if(this.props.dataReady){
      return (
        <div ref="sectionSkills">
            <div className="row">
            <div className="col-md-1 col-sm-1 col-xs-1"></div>
                <div className="col-md-10 col-sm-10 col-xs-10">
                    {this.renderCategories()}
                </div> 
                <div className="col-md-1 col-sm-1 col-xs-1"></div>
            </div>

            <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="sectionprofile sectiongreybgGradient arrow paddingZero" id="outer">
                    <a className="fontbttn  arrowbttn profilebttn w-button" id="specificUser" onClick={this.expand.bind(this)}>
                    <center>
                        <div className="arrow2">  <img src="/img/icon_updown.png"/> </div>
                    </center>
                    </a>
                </div>
                </div>
            </div>
        </div>
      );
    }else{
      return(
        <Loading2/>
      );
    }
    
  }
}

export default withTracker((props) => {
  var dataReady;
  var feedbacks;
  var user;
  var handle = Meteor.subscribe('feedback', {
      onError: function (error) {
              console.log(error);
          }
      });
    if(Meteor.user() && handle.ready()){
        let user = Meteor.users.findOne({_id : props.quizPerson});
        feedbacks = Feedback.find({ 'to' : user._id }).fetch();
        dataReady = true;
    }
  

  return {
      user: user,
      feedbacks: feedbacks,
      dataReady:dataReady,
  };
})(SkillCategories);

