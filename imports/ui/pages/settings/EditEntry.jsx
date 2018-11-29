import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Menu from '/imports/ui/pages/menu/Menu';
import Loading from '/imports/ui/pages/loading/Loading';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

class EditEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state={
        updating:false,
        gender:undefined,
        locale:i18n.getLocale(),
        showInfo:false,
        showInfoMessage:""
    }
  }
  
  componentDidMount(){
    this.syncStateValue(this.props);
  }

  componentWillReceiveProps(nextProps){
    this.syncStateValue(nextProps);
  }

  syncStateValue(props){
    if(props.currentUser.profile.gender){
        this.setState({
            gender:props.currentUser.profile.gender,
        })
    }
  }

  genderChange(gender){
    this.setState({
        gender:gender,
    })
  }

  localeChange(locale){
    this.setState({
        locale:locale,
    })
  }

  handleNameSubmit(event){
    event.preventDefault();
    var firstName = ReactDOM.findDOMNode(this.refs.firstName).value.trim();
    var lastName = ReactDOM.findDOMNode(this.refs.lastName).value.trim();

    if(firstName && lastName && firstName != "" && lastName != ""){
        this.setState({
            updating: true,
        });
        Meteor.call( 'user.update.name', firstName, lastName, ( error, response ) => {
            this.setState({
              updating: false,
            });
            if ( error ) {
                console.log(error);
                this.setState({ 
                    showInfo: true,
                    showInfoMessage:error.error
                });
            }else{
                this.props.history.goBack();
            }
        });
    }
  }

  handleEmailSubmit(event){
    event.preventDefault();
    var email = ReactDOM.findDOMNode(this.refs.email).value.trim();
    
    if(email && email != "" && !this.state.updating){
        if(email && email != "" && email == this.props.currentUser.emails[0].address){
            this.setState({ 
                showInfo: true,
                showInfoMessage:i18n.getTranslation("weq.settingsEdit.ErrorEmailSameOld")
            });
        }else{
            this.setState({
                updating: true,
            });
            Meteor.call( 'change.email.verification.send', email, ( error, response ) => {
                this.setState({
                  updating: false,
                });
                if ( error ) {
                    console.log(error);
                    this.setState({ 
                        showInfo: true,
                        showInfoMessage:error.error
                    });
                }else{
                    this.setState({ 
                        updateEmailVerificationSent: true,
                    });
                }
            });
        }
    }
  }

  handleGenderSubmit(){
    if(this.state.gender && this.state.gender != ""){
        this.setState({
            updating: true,
        });
        Meteor.call( 'user.update.gender', this.state.gender, ( error, response ) => {
            this.setState({
              updating: false,
            });
            if ( error ) {
                console.log(error);
                this.setState({ 
                    showInfo: true,
                    showInfoMessage:error.error
                });
            }else{
                this.props.history.goBack();
            }
        });
    }
  }

  handleLocaleSubmit(){
    if(this.state.locale && this.state.locale != ""){
        this.setState({
            updating: true,
        });
        Meteor.call( 'user.set.locale', this.state.locale, ( error, response ) => {
            this.setState({
              updating: false,
            });
            if ( error ) {
                console.log(error);
                this.setState({ 
                    showInfo: true,
                    showInfoMessage:error.error
                });
            }else{
                this.props.history.goBack();
            }
        });
    }
  }

  render() {
    var content;
    var type = this.props.match.params.type;
    var title = "";
    if(this.props.currentUser){
        if(type == "name"){
            title = i18n.getTranslation("weq.settingsEdit.TitleName");
            content = 
            <div className="settings-edit-wrapper">
                <div className="fontreleway edit settings title">
                {i18n.getTranslation("weq.settingsEdit.CurrentName")}
                </div>
                <div className="fontreleway font-invite-title w-clearfix">
                {getUserName(this.props.currentUser.profile)}
                </div>
                <br/>
                <div className="fontreleway edit settings title">
                {i18n.getTranslation("weq.settingsEdit.NewInformationBelow")}
                </div>
                <form className="loginemail" data-name="Email Form" name="email-form" onSubmit={onClick=this.handleNameSubmit.bind(this)}>
                    <input className="emailfield w-input" maxLength="256" ref="firstName" placeholder={i18n.getTranslation("weq.settingsEdit.FirstName")} required="required" type="text"/>
                    <input className="emailfield w-input" maxLength="256" ref="lastName" placeholder={i18n.getTranslation("weq.settingsEdit.LastName")} required="required" type="text"/>
                    <input className="submit-button w-button" type="submit" value={i18n.getTranslation("weq.settingsEdit.ChangeName")}/>
                </form>
            </div>;
        }
        else if(type == "email"){
            title = i18n.getTranslation("weq.settingsEdit.TitleEmail");
            content = 
            <div className="settings-edit-wrapper">
                <div className="fontreleway edit settings title">
                {i18n.getTranslation("weq.settingsEdit.CurrentEmail")}
                </div>
                <div className="fontreleway font-invite-title w-clearfix">
                {this.props.currentUser.emails && this.props.currentUser.emails[0].address}
                </div>
                <br/>
                <div className="fontreleway edit settings title">
                {i18n.getTranslation("weq.settingsEdit.NewInformationBelow")}
                </div>
                <form className="loginemail" data-name="Email Form" name="email-form" onSubmit={this.handleEmailSubmit.bind(this)}>
                    <input className="emailfield w-input" maxLength="256" ref="email" placeholder={i18n.getTranslation("weq.settingsEdit.EmailAddress")} type="email" style={{textTransform:"lowercase"}} required/>
                    
                    {this.state.updating ?
                    <input className="submit-button w-button" type="submit" value={i18n.getTranslation("weq.settingsEdit.Updating")} disabled={true}/>
                    :
                    <input className="submit-button w-button" type="submit" value={i18n.getTranslation("weq.settingsEdit.ChangeEmail")}/>
                    }
                </form>
            </div>
        }
        else if(type == "gender"){
            title = i18n.getTranslation("weq.settingsEdit.TitleGender")
            content = 
            <div className="settings-edit-wrapper">
                <div className="fontreleway w-block">
                    <label className="fontreleway edit settings title">{i18n.getTranslation("weq.settingsEdit.CurrentGender")}</label>
                    <div className="form-radio-group">
                      <div className="form-radio w-radio">
                        <label className="field-label w-form-label">
                          <input type="radio" name="gender" id="m" ref="male" value="Male" className="w-radio-input" required 
                          checked={this.state.gender == "Male"}
                          onChange={this.genderChange.bind(this,"Male")}/>
                          {i18n.getTranslation("weq.settingsEdit.GenderMale")}
                          </label>
                      </div>
                      <div className="form-radio w-radio">
                        <label className="field-label w-form-label">
                          <input type="radio" name="gender" id="f" ref="female" value="Female" className="w-radio-input" required
                          checked={this.state.gender == "Female"}
                          onChange={this.genderChange.bind(this,"Female")}/>
                          {i18n.getTranslation("weq.settingsEdit.GenderFemale")}
                        </label>
                      </div>
                    </div>
                    <input className="submit-button w-button" type="submit" value={i18n.getTranslation("weq.settingsEdit.SaveChanges")} onClick={this.handleGenderSubmit.bind(this)}/>
                </div>
            </div>
        }
        else if(type == "languages"){
            title = i18n.getTranslation("weq.settingsEdit.TitleLanguage")
            content = 
            <div className="settings-edit-wrapper">
                <div className="fontreleway w-block">
                    <label className="fontreleway edit settings title">{i18n.getTranslation("weq.settingsEdit.CurrentLanguage")}</label>
                    <div className="form-radio-group">
                      <div className="form-radio w-radio">
                        <label className="field-label w-form-label">
                          <input type="radio" name="locale" value="en-US" className="w-radio-input" 
                          checked={this.state.locale == "en-US"}
                          onChange={this.localeChange.bind(this,"en-US")}/>
                          English
                          </label>
                      </div>
                      <div className="form-radio w-radio">
                        <label className="field-label w-form-label">
                          <input type="radio" name="locale" value="nl-NL" className="w-radio-input"
                          checked={this.state.locale == "nl-NL"}
                          onChange={this.localeChange.bind(this,"nl-NL")}/>
                          Nederlands
                        </label>
                      </div>
                    </div>
                    <input className="submit-button w-button" type="submit" value={i18n.getTranslation("weq.settingsEdit.SaveChanges")} onClick={this.handleLocaleSubmit.bind(this)}/>
                </div>
            </div>
        } 
        else{
            content = <Redirect to={"/404"}/>;
        }
        return(
            <div className="fillHeight">
                <Menu location={this.props.location} history={this.props.history}/>
                <section>
                <div className="screentitlewrapper w-clearfix">
                    <div className="screentitlebttn back">
                        <a className="w-clearfix w-inline-block cursor-pointer" onClick={()=>{
                            if(!this.state.updating){
                                this.props.history.goBack();
                            }
                        }}>
                        <img className="image-7" src="/img/arrow.svg"/>
                        </a>
                    </div>
                    <div className="fontreleway font-invite-title w-clearfix w-inline-block">
                        {title}
                    </div>
                </div>
                {content}

                {this.state.showInfo &&
                    <SweetAlert
                    type={"info"}
                    message={this.state.showInfoMessage}
                    onCancel={() => {
                        this.setState({ showInfo: false });
                    }}/>
                }

                {this.state.updateEmailVerificationSent &&
                    <SweetAlert
                    type={"info"}
                    message={"Verification email sent to email, Please follow the link in the email to change your email"}
                    onCancel={() => {
                        this.props.history.goBack();
                    }}/>
                }
                
                </section>
            </div>
        )
    }else{
        return(
            <Loading/>
        );
    }
    
  }
}

export default withTracker((props) => {
    return {
        currentUser: Meteor.user(),
    };
})(EditEntry);
  
  




