import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Menu from '/imports/ui/pages/menu/Menu';
import Loading from '/imports/ui/pages/loading/Loading';

class EditEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state={
        updating:false,
        gender:undefined,
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
        this.setState({
            updating: true,
        });
        Meteor.call( 'user.update.email', email, ( error, response ) => {
            this.setState({
              updating: false,
            });
            if ( error ) {
              console.log(error);
            }else{
                this.props.history.goBack();
            }
        });
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
            }else{
                this.props.history.goBack();
            }
        });
    }
  }

  render() {
    var content;
    var type = this.props.match.params.type;
    if(this.props.currentUser){
        if(type == "name"){
            content = 
            <div className="settings-edit-wrapper">
                <div className="fontreleway edit settings title">
                current name:
                </div>
                <div className="fontreleway font-invite-title w-clearfix">
                {getUserName(this.props.currentUser.profile)}
                </div>
                <div className="fontreleway edit settings title">
                Enter new information below:
                </div>
                <form className="loginemail" data-name="Email Form" name="email-form" onSubmit={onClick=this.handleNameSubmit.bind(this)}>
                    <input className="emailfield w-input" maxLength="256" ref="firstName" placeholder="first name" required="required" type="text"/>
                    <input className="emailfield w-input" maxLength="256" ref="lastName" placeholder="last name" required="required" type="text"/>
                    <input className="submit-button w-button" type="submit" value="Change Name"/>
                </form>
            </div>
        }
        else if(type == "email"){
            content = 
            <div className="settings-edit-wrapper">
                <div className="fontreleway edit settings title">
                current email:
                </div>
                <div className="fontreleway font-invite-title w-clearfix">
                {this.props.currentUser.emails && this.props.currentUser.emails[0].address}
                </div>
                <div className="fontreleway edit settings title">
                Enter new information below:
                </div>
                <form className="loginemail" data-name="Email Form" name="email-form" onSubmit={this.handleEmailSubmit.bind(this)}>
                    <input className="emailfield w-input" maxLength="256" ref="email" placeholder="email address" type="text" style={{textTransform:"lowercase"}} required/>
                    <input className="submit-button w-button" type="submit" value="Change Email"/>
                </form>
            </div>
        }
        else if(type == "gender"){
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
                            this.props.history.goBack();
                        }}>
                        <img className="image-7" src="/img/arrow.svg"/>
                        </a>
                    </div>
                </div>
                {content}
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
  
  




