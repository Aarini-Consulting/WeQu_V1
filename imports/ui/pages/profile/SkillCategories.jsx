import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

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
    if(nextProps.dataReady && nextProps.user && nextProps.feedbacks)
    {
        let userId = nextProps.user._id;
        var data = { userId:userId, profile : nextProps.user.profile };
        
        var validAnswers = _.filter(joinFeedbacks(nextProps.feedbacks), function(question) { return question.answer });
        
        var otherscore = calculateScore(joinFeedbacks(nextProps.feedbacks), true);
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
                <div className="skillElement" key={skill.category + " " +skill.name}>
                    <div className="title">{skill.name}</div>
                    <div className="underBar" style={{width:60+"%"}}>
                    <div className={"bar "+skill.category} style={{width:skill.value + "%"}}></div>
                    </div>
                    <div className="score w-inline-block" style={{width:6+"em"}}>
                    {skill.total <= 0 
                    ?"0/0"
                    :skill.scored +"/"+ skill.total
                    }
                    </div>
                </div>
            );
          });
    }

    renderCategories(){
        if(this.state.data && this.state.data.categories){
            var categories = this.state.data.categories
            if(!this.state.expand){
                categories = this.state.data.categories.slice(0,2);
            }
            
            if(categories){
                return categories.map((cat) => {
                    return (
                        <div key={"skillset "+cat.name} className="skill-elements-wrapper">
                            <div className="skillElement">
                                <div className="title"><b className="h5">{cat.name}</b></div>
                            </div>
                            {this.renderSkills(cat.skills)}
                        </div>
                    );
                  });
            }else{
                return(<h1>no data</h1>);
            }
            
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
            <div className="row-center-10 w-container">
                {this.renderCategories()}
            </div>

            {this.state.data && this.state.data.categories && this.state.data.categories.length > 0 &&
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
            }
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
  var handleFeedback
  var handleUsers = Meteor.subscribe('users',{_id : props.quizPerson},{}, {
    onError: function (error) {
            console.log(error);
        }
  });

  if(handleUsers.ready()){
    user = Meteor.users.findOne({_id : props.quizPerson});
    if(user){
        handleFeedback = Meteor.subscribe('feedback',{'to' : user._id},{}, {
            onError: function (error) {
                    console.log(error);
                }
            });
            
        if(handleFeedback.ready()){
            feedbacks = Feedback.find({ 'to' : user._id }).fetch();
            dataReady = true;
        }
    }else{
        dataReady = true;
    }
  }

    

  return {
      user: user,
      feedbacks: feedbacks,
      dataReady:dataReady,
  };
})(SkillCategories);

