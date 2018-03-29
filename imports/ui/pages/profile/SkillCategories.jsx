import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Loading2 from '/imports/ui/pages/loading/Loading2';

class SkillCategories extends React.Component {
  constructor(props){
      super(props);
      this.state={
        expand:false
      }
    }

    renderCategorySkills(skills, compareSkills){
        return skills.map((skill, index) => {
            return (
                <div className="skillElement" key={skill.category + " " +skill.name}>
                    <div className="title">{skill.name}</div>

                    {compareSkills && compareSkills[index] && compareSkills[index].name == skill.name 
                        ?
                        <div className="underBar" style={{width:60+"%"}}>
                            <div className={"bar compare-bar"} style={{width:compareSkills[index].value + "%"}}></div>
                            <div className={"bar compare-skill "+skill.category} style={{width:skill.value + "%"}}></div>
                        </div>
                        :
                        <div className="underBar" style={{width:60+"%"}}>
                            <div className={"bar "+skill.category} style={{width:skill.value + "%"}}></div>
                        </div>
                    }

                    
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
        if(this.props.categories){
            var categories = this.props.categories
            if(!this.state.expand){
                categories = categories.slice(0,2);
            }
            
            if(categories){
                return categories.map((cat, index) => {
                    return (
                        <div key={"skillset "+cat.name} className="skill-elements-wrapper">
                            <div className="skillElement">
                                <div className="title"><b className="h5">{cat.name}</b></div>
                            </div>
                            {this.props.categoriesCompare && this.props.categoriesCompare[index] 
                            && this.props.categoriesCompare[index].name == cat.name
                                ?this.renderCategorySkills(cat.skills, this.props.categoriesCompare[index].skills)
                                :this.renderCategorySkills(cat.skills)
                            }
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

            {this.props.categories.length > 0 &&
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
  })(SkillCategories);

