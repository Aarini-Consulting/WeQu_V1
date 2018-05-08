import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Menu from '/imports/ui/pages/menu/Menu';
import Loading from '/imports/ui/pages/loading/Loading';
import SweetAlert from '/imports/ui/pages/sweetAlert/SweetAlert';

class EditEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state={
        updating:false,
        gender:undefined,
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

  handleNameSubmit(event){
    event.preventDefault();
    var firstName = ReactDOM.findDOMNode(this.refs.firstName).value.trim();
    var lastName = ReactDOM.findDOMNode(this.refs.lastName).value.trim();

    console.log(firstName);
    console.log(lastName);

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
                showInfoMessage:"new email is the same as the old one"
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

  render() {
    var content;
    var type = this.props.match.params.type;
    var title = "";
    if(this.props.currentUser){
        if(type == "name"){
            title = "Name";
            content = 
            <div className="settings-edit-wrapper">
                <div className="fontreleway edit settings title">
                current name:
                </div>
                <div className="fontreleway font-invite-title w-clearfix">
                {getUserName(this.props.currentUser.profile)}
                </div>
                <br/>
                <div className="fontreleway edit settings title">
                Enter new information below:
                </div>
                <form className="loginemail" data-name="Email Form" name="email-form" onSubmit={onClick=this.handleNameSubmit.bind(this)}>
                    <input className="emailfield w-input" maxLength="256" ref="firstName" placeholder="first name" required="required" type="text"/>
                    <input className="emailfield w-input" maxLength="256" ref="lastName" placeholder="last name" required="required" type="text"/>
                    <input className="submit-button w-button" type="submit" value="Change Name"/>
                </form>
            </div>;
        }
        else if(type == "email"){
            title = "Email";
            content = 
            <div className="settings-edit-wrapper">
                <div className="fontreleway edit settings title">
                current email:
                </div>
                <div className="fontreleway font-invite-title w-clearfix">
                {this.props.currentUser.emails && this.props.currentUser.emails[0].address}
                </div>
                <br/>
                <div className="fontreleway edit settings title">
                Enter new information below:
                </div>
                <form className="loginemail" data-name="Email Form" name="email-form" onSubmit={this.handleEmailSubmit.bind(this)}>
                    <input className="emailfield w-input" maxLength="256" ref="email" placeholder="email address" type="email" style={{textTransform:"lowercase"}} required/>
                    
                    {this.state.updating ?
                    <input className="submit-button w-button" type="submit" value="Updating..." disabled={true}/>
                    :
                    <input className="submit-button w-button" type="submit" value="Change Email"/>
                    }
                </form>
            </div>
        }
        else if(type == "gender"){
            title = "Gender"
            content = 
            <div className="settings-edit-wrapper">
                <div className="fontreleway w-block">
                    <label className="fontreleway edit settings title">Your Gender: </label>
                    <div className="form-radio-group">
                      <div className="form-radio w-radio">
                        <label className="field-label w-form-label">
                          <input type="radio" name="gender" id="m" ref="male" value="Male" className="w-radio-input" required 
                          checked={this.state.gender == "Male"}
                          onChange={this.genderChange.bind(this,"Male")}/>
                          Male
                          </label>
                      </div>
                      <div className="form-radio w-radio">
                        <label className="field-label w-form-label">
                          <input type="radio" name="gender" id="f" ref="female" value="Female" className="w-radio-input" required
                          checked={this.state.gender == "Female"}
                          onChange={this.genderChange.bind(this,"Female")}/>
                          Female
                        </label>
                      </div>
                    </div>
                    <input className="submit-button w-button" type="submit" value="Save Changes" onClick={this.handleGenderSubmit.bind(this)}/>
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
  
  




