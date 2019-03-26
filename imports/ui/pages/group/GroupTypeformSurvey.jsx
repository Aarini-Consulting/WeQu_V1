import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

import Loading from '/imports/ui/pages/loading/Loading';

export default class GroupTypeformSurvey extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            gettingTypeformResult:false,
            gettingCombinedResult:false,
            combinedResult:undefined
        };
    }

    componentDidMount(){
        if(!this.state.combinedResult){
            this.getAverageScore();
        }
    }

    getAverageScore(){
        if(!this.state.gettingCombinedResult){
            this.setState({
                gettingCombinedResult: true,
            },()=>{
                Meteor.call('get.group.typeform.average', (error, result)=>{
                    if(error){
                        console.log(error);
                    }
                    this.setState({
                        combinedResult: result,
                    });
    
                    this.setState({
                        gettingCombinedResult: false,
                    });
                });
            });
        }
        
    }

    toggleMatrixInfoPanel(skillName){
        var matrix = this.state.showMatrixInfoPanel;
    
        if(!matrix){
          matrix = {};
        }
    
        if(matrix && matrix[skillName]){
          matrix[skillName]=false;
        }else{
          matrix[skillName]=true;
        }
        this.setState({
          showMatrixInfoPanel:matrix
        });
      }

    getTypeFormResult(){
        if(!this.state.gettingTypeformResult && this.props.group.userIds && this.props.group.userIdsSurveyed && this.props.group.userIds.length == this.props.group.userIdsSurveyed.length){
            this.setState({
            gettingTypeformResult: true,
            },()=>{
                var supportedLocale = Meteor.settings.public.supportedLocale;

                var formIds = [];

                supportedLocale.forEach((locale)=>{
                var languageCode = locale.split("-")[0];
                var formIdTest = Meteor.settings.public.typeformTestFormCode;
                var formIdProd =  Meteor.settings.public.typeformProdFormCode;

                var formIdSelected;

                if(window.location.hostname == "app.weq.io"){
                    formIdSelected = formIdProd[languageCode];
                    if(!formIdSelected){
                    formIdSelected = formIdProd["en"];
                    }
                }else{
                    formIdSelected = formIdTest[languageCode];
                    if(!formIdSelected){
                    formIdSelected = formIdTest["en"];
                    }
                }

                formIds.push(formIdSelected);
                });

                Meteor.call('get.all.response.typeform', this.props.group._id, formIds, this.props.group.createdAt, (error, result)=>{
                    if(error){
                        console.log(error);
                    }

                    this.setState({
                        gettingTypeformResult: false,
                    });
                });
            });
        }
    }

      
    renderSurveyGraph(skills){
        if(!skills || skills.length < 1){
          if(this.props.group && this.props.group.userIds && this.props.group.userIdsSurveyed && this.props.group.userIds.length == this.props.group.userIdsSurveyed.length){
            return(
              <div className="create-chart-tab">
                  <div className="create-chart-wrapper">
                    <div className="create-chart-icon-wrapper">
                      <i className="far fa-chart-bar"></i>
                    </div>
                    {this.state.gettingTypeformResult 
                      ?
                      <div className="invitebttn create-chart w-button w-inline-block noselect">
                        Loading...
                      </div>
                      :
                      <div className="invitebttn create-chart w-button w-inline-block" onClick={this.getTypeFormResult.bind(this)}>
                        Calculate survey result
                      </div>
                    }
                    
                  </div>
                </div>
            );
          }else{
            return(
              <div className="font-matric">
                Please check again when all surveys are completed
                {this.renderUsersSurvey()}
              </div>
            )
          }
        }
        else{
          var skills = skills.map((skill, index) => {
            var leftPos = 0;
            var leftPosAvg = 0;
            var total = skill.total || 0;
            var score = skill.score || 0;
            var combinedTotal = this.state.combinedResult && this.state.combinedResult.combinedTotal && this.state.combinedResult.combinedTotal[skill.name];
            var combinedScore = this.state.combinedResult && this.state.combinedResult.combinedScore && this.state.combinedResult.combinedScore[skill.name];

            var formattedScore = Number.parseFloat(score).toPrecision(2);
    
            var value = 0;
            if(total > 0){
              value = formattedScore/total * 100;
            }
            
            if(value > 0){
              leftPos = `calc(${ value }% - 40px)`;
            }

            if(!combinedScore){
                combinedScore = 0;
            }

            if(!combinedTotal || combinedTotal < 0){
                combinedTotal = 1;
            }

            var avgValue = 0;
            avgValue = (combinedScore/combinedTotal)*100;
            if(avgValue > 0){
                leftPosAvg = `calc(${avgValue}% - 8px)`;
            }else{
                leftPosAvg = 0;
            }
            
    
            var infoText = undefined;
            var skillName = undefined;
    
            switch(skill.name){
              case "Psychological Safety":
                skillName = i18n.getTranslation("weq.groupPage.PsychologicalSafety");
                infoText = <div className="font-matric font-info">
                <T>weq.groupPage.PsychologicalSafetyText1</T><br/>
                <T>weq.groupPage.PsychologicalSafetyText2</T><br/>
                <T>weq.groupPage.PsychologicalSafetyText3</T>
                </div>
                break;
              case "Constructive Feedback":
                skillName = i18n.getTranslation("weq.groupPage.ConstructiveFeedback");
                infoText = <div className="font-matric font-info">
                <T>weq.groupPage.ConstructiveFeedbackText1</T><br/>
                <T>weq.groupPage.ConstructiveFeedbackText2</T><br/>
                <T>weq.groupPage.ConstructiveFeedbackText3</T>
                </div>
                break;
              case "Cognitive Bias":
                skillName = i18n.getTranslation("weq.groupPage.CognitiveBias");
                infoText = <div className="font-matric font-info">
                <T>weq.groupPage.CognitiveBiasText1</T><br/>
                <T>weq.groupPage.CognitiveBiasText2</T><br/>
                <T>weq.groupPage.CognitiveBiasText3</T>
                </div>
                break;
              case "Control over Cognitive Bias":
                skillName = i18n.getTranslation("weq.groupPage.CognitiveBias");
                infoText = <div className="font-matric font-info">
                <T>weq.groupPage.CognitiveBiasText1</T><br/>
                <T>weq.groupPage.CognitiveBiasText2</T><br/>
                <T>weq.groupPage.CognitiveBiasText3</T>
                </div>
                break;
              case "Social Norms":
                skillName = i18n.getTranslation("weq.groupPage.SocialNorms");
                infoText = <div className="font-matric font-info">
                <T>weq.groupPage.SocialNormsText1</T><br/>
                <T>weq.groupPage.SocialNormsText2</T><br/>
                <T>weq.groupPage.SocialNormsText3</T>
                </div>
                break;
              default:
                skillName = skill.name;
                infoText = <div className="font-matric font-info">
                <T>weq.groupPage.NoMatrixInfo</T>
                </div>
                break;
            }
            
            return (
              <div key={skill.name}>
                <div className="tap-content w-clearfix">
                  <div className="tap-left typeform-survey-graph">
                    <div className="font-matric">
                      {skillName}
                    </div>
                    <div className="w-inline-block font-matric-info" onClick={this.toggleMatrixInfoPanel.bind(this, skill.name)}>
                    <i className="fas fa-info-circle"></i>
                    </div>
                  </div>
                  <div className="show-numbers typeform-survey-graph">
                    <div className="chart-graph w-clearfix">
                      <div className="chart-graph bg"></div>
                      <div className="chart-graph active" style={{width:value + "%"}}></div>
                      <div className="chart-number" style={{left:leftPos}}>
                        <div className="font-chart-nr">{formattedScore}</div>
                      </div>
                      <div className="chart-number average" style={{left:leftPosAvg}}></div>
                      
                    </div>
                  </div>
                  <div className="tap-right typeform-survey-graph">
                    <div className="font-matric">
                      {total}
                    </div>
                  </div>
                </div>
                {this.state.showMatrixInfoPanel && this.state.showMatrixInfoPanel[skill.name] && infoText &&
                  <div className="w-block matric-info-panel" onClick={this.toggleMatrixInfoPanel.bind(this, skill.name)}>
                    <div className="font-matric font-close">
                      <i className="fa fa-window-close" aria-hidden="true"></i>
                    </div>
                    {infoText}
                  </div>
                }
                
              </div>
            );
          });
    
          return (
            <div>
              {skills}
              <br/>
              <br/>
              <div className="tap-content-footer typeform-survey-graph">
                  <div className="survey-graph-footer">
                    <div className="font-matric-refresh">
                      Average Score
                    </div>
                    <div className="survey-graph-footer-legend noselect">
                      <div className="chart-graph survey-graph-footer-legend ">
                        <div className="chart-graph bg legend"></div>
                        <div className="chart-number average" style={{left:`calc(${ 50 }% - 4px)`}}></div>
                      </div>
                    </div>
                  </div>
              </div>
              <br/>
              <div className="tap-content-footer typeform-survey-graph">
                <div className="survey-graph-footer">
                  <div className="font-matric-refresh">
                    {this.props.group.userIdsSurveyed.length} out of {this.props.group.userIds.length} people
                    <br/>
                    completed the survey
                  </div>
                  {this.state.gettingTypeformResult 
                    ?
                    <div className="invitebttn create-chart refresh w-button w-inline-block noselect">
                      Loading...
                    </div>
                    :
                    <div className="invitebttn create-chart refresh w-button w-inline-block" onClick={this.getTypeFormResult.bind(this)}>
                      Refresh
                    </div>
                  }  
                </div>
            </div>
          </div>
          );
        }
      }

      renderUsersSurvey(){
        return this.props.users.map((user, index) => {
          var userId = user._id;
          var email = user.emails[0].address;
          var readySurvey;
          if(this.props.group.userIdsSurveyed && this.props.group.userIdsSurveyed.indexOf(userId) > -1){
            readySurvey = true;
          }
    
          var odd = (index % 2) > 0;
    
          var name;
    
          if(user.profile.firstName && user.profile.lastName){
            name = user.profile.firstName + " " + user.profile.lastName;
          }else{
            name = email;
          }
    
          return(
            <div className={"tap-content w-clearfix" + (odd ? " grey-bg": "")} key={user._id}>
              <div className="tap-left card">
                <div className={"font-card-username "+(readySurvey ? "ready": "not-ready")}>
                  {name}
                </div>
              </div>
              <div className="show-cards">
                {
                  readySurvey 
                  ? 
                    <div className="bttn-next-card">Ready!</div>
                  : 
                  <div>
                    {!readySurvey && <div className="bttn-next-card not-ready">Survey incomplete</div>}
                  </div>
                }
              </div>
            </div>
          )
        });
      }

      render() {
        if(this.state.combinedResult){
            return (
                <div className="tap-content-wrapper typeform-survey-graph">
                    {this.renderSurveyGraph(this.props.group.typeformGraph)}
                </div>
            );
        }else{
            return(
                <div className="fillHeight">
                  <Loading/>
                </div>
              );
        }
    }
}
