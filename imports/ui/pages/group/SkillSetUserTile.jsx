import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Loading2 from '/imports/ui/pages/loading/Loading2';

class SkillSetUserTile extends React.Component {
  renderCategorySkills(skills){
    return skills.map((skill) => {
        return (
            <div key={skill.name} className="skillElement">
              <div className="title font-title font18" style={{width:20+"%"}}>
                {skill.name} </div>
              <div className="underBar" style={{width:40+"%"}}>
                <div className={"bar "+skill.category} style={{width:skill.value + "%"}}></div>
              </div>
              <div className="font-title font18 marginleft3P" style={{width:10+"%"}}>
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
    return this.props.categories.map((cat) => {
        return (
            <div key={cat.name}>
                <div className="skillElement">
                  <div className="title font-title font18">{cat.name}</div>
                </div>
                {this.renderCategorySkills(cat.skills)}
            </div>
        );
      });
  }

  render() {
    if(this.props.dataReady){
      return (
        <div className="col-md-12 col-sm-12 col-xs-12">
            {this.renderCategories()}
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
    var user;
    var myScore;
    var score;
    var himselfAnswered = 0;
    var inviteesAnsweredHim = 0;
    var skillData;
    var categories={};
    var handleFeedback;
    var handleUsers;
  
    score = calculateScore(joinFeedbacks(props.feedback), true);

    categories = _.map(_.keys(framework), function(category) {
            return {
                name : i18n[category],
                category : category,
                skills : _.map(framework[category], function(skill){
                    var data = {name : i18n[skill], value: 0, scored: score.scored[skill], total: score.total[skill], skill: skill, category: category }
                    if(score.total[skill] > 0) {
                        data.value = Math.round(score.scored[skill] * 100 / score.total[skill]);
                    }
                    return data;
                })
            }
    });
    
    dataReady = true;
    
    return {
        categories:categories,
        dataReady:dataReady
    };
  })(SkillSetUserTile);

