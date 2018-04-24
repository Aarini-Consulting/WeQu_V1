import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Loading2 from '/imports/ui/pages/loading/Loading2';

class SkillSetUserTile extends React.Component {
  renderCategorySkills(skills, compareSkills){
    return skills.map((skill, index) => {
        return (
            <div key={skill.name} className="skillElement">
                <div className="title font-title font18" style={{width:20+"%"}}>
                    {skill.name} 
                </div>
                {compareSkills && compareSkills[index] && compareSkills[index].name == skill.name 
                ?
                <div className="underBar" style={{width:40+"%"}}>
                    <div className={"bar compare-bar"} style={{width:compareSkills[index].value + "%"}}></div>
                    {compareSkills[index].total > 0 &&
                        <div className={"bar compare-skill bg "+skill.category} 
                        style={{width:Math.round(skill.scored * 100/compareSkills[index].total) + "%"}}></div>
                    }
                </div>
                :
                <div className="underBar" style={{width:40+"%"}}>
                    <div className={"bar bg "+skill.category} style={{width:skill.value + "%"}}></div>
                </div>
                }
                {compareSkills && compareSkills[index] && compareSkills[index].name == skill.name 
                ?
                <div className="font-title font18 marginleft3P" style={{width:10+"%"}}>
                    {compareSkills[index].total <= 0 
                    ?"0/0"
                    :skill.scored +"/"+ compareSkills[index].total
                    }
                </div>
                :
                <div className="font-title font18 marginleft3P" style={{width:10+"%"}}>
                    {skill.total <= 0 
                    ?"0/0"
                    :skill.scored +"/"+ skill.total
                    }
                </div>
                }
              
            </div>
        );
      });
  }

  renderCategories(){
    return this.props.categories.map((cat, index) => {
        return (
            <div key={cat.name}>
                <div className="skillElement">
                  <div className={"title font-title font18" + " color " + cat.category}>{cat.name}</div>
                </div>
                {this.props.categoriesCompare && this.props.categoriesCompare[index] 
                && this.props.categoriesCompare[index].name == cat.name
                ?this.renderCategorySkills(cat.skills, this.props.categoriesCompare[index].skills)
                :this.renderCategorySkills(cat.skills)
                }
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
    var scoreCompare;
    var score;
    var categories;
    var categoriesCompare;
  
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

    if(props.feedbackCompare){
        scoreCompare = calculateScore(joinFeedbacks(props.feedbackCompare), true);
        categoriesCompare = _.map(_.keys(framework), function(category) {
            return {
                name : i18n[category],
                category : category,
                skills : _.map(framework[category], function(skill){
                    var data = {name : i18n[skill], value: 0, scored: scoreCompare.scored[skill], total: scoreCompare.total[skill], skill: skill, category: category }
                    if(scoreCompare.total[skill] > 0) {
                        data.value = Math.round(scoreCompare.scored[skill] * 100 / scoreCompare.total[skill]);
                    }
                    return data;
                })
            }
    });

    }
    
    dataReady = true;
    
    return {
        categories:categories,
        categoriesCompare:categoriesCompare,
        dataReady:dataReady
    };
  })(SkillSetUserTile);

