import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Loading from '/imports/ui/pages/loading/Loading';

import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

import {Group} from '/collections/group';

class GroupReportPage extends React.Component {
    constructor(props){
        super(props);
        var locale = i18n.getLocale().split("-")[0];
        if (locale == 'es') {
            locale = i18n.getLocale();
        }
        this.state={
          selectedUser:false,
          preview:undefined,
          loadingPreview:false,
          generatingPdf:false,
          languages:Meteor.settings.public.languages,
          downloadIndividualLang:locale,
          downloadAllLang:locale
        }
    }

    handleChangeIndividualLang(event) {
        this.setState(
            { 
                downloadIndividualLang: event.target.value,
                loadingPreview: true, 
                preview:undefined 
            },()=>{
                if(this.state.selectedUser && this.props.group){
                    this.generatePreview(this.state.downloadIndividualLang);
                }
            }
        );
    }

    handleChangeAllLang(event) {
        this.setState({downloadAllLang: event.target.value});
    }

    downloadPdfMulti(){
        this.setState({ generatingPdf: true });
        Meteor.call('download.report.group.pdf',this.props.group._id, this.state.downloadAllLang, (error, response) => {
          if (error) {
            console.log(error);
          } else {
            if(response.results && Array.isArray(response.results)){
              var JSZip = require("jszip");
              var zip = new JSZip();
              response.results.forEach((res)=>{
                zip.file(res.fileName,res.base64,{base64:true});
              });
    
              zip.generateAsync({type:"blob"})
              .then((blob) => {
                var link = document.createElement("a");
                link.download = response.zipName;
                link.href= window.URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              });
            }
          }
          this.setState({ generatingPdf: false });
        });
    }

    downloadPdf(){
        this.setState({ generatingPdf: true });
        Meteor.call('download.report.individual.pdf',this.props.group._id, this.state.selectedUser, this.state.downloadIndividualLang, (error, response) => {
          if (error) {
            console.log(error);
          } else {
            var JSZip = require("jszip");
            var zip = new JSZip();
            zip.file(response.fileName,response.base64,{base64:true});
    
            zip.generateAsync({type:"blob"})
            .then((blob) => {
              var link = document.createElement("a");
              link.download = response.fileName;
              link.href= window.URL.createObjectURL(blob);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });
          }
          this.setState({ generatingPdf: false });
        });
    }
    selectUser(uid){
        this.setState({ loadingPreview: true, selectedUser: uid, preview:undefined },()=>{
            if(this.state.selectedUser && this.props.group){
                this.generatePreview(this.state.downloadIndividualLang);
            }
        });
    }
    generatePreview(languageCode){
        Meteor.call('generate.preview',this.props.group._id, this.state.selectedUser, languageCode, (error, response) => {
            if (error) {
              console.log(error);
            } else {
                if(response && response.base64){
                    var image = "data:image/png;base64,"+response.base64;
                    this.setState({ preview: image });
                }
            }
            this.setState({ loadingPreview: false });
          });
    }

    renderLanguageList(){
        return this.state.languages.map((val,index,array)=>{
            return(
                <option key={"select-lang"+index} value={val.code}>{val.name}</option>
            );
        })
    }

    render() {
        if(this.props.dataReady){
            if(this.props.group){
                return (
                    <div className="report-page-container">
                        <div className="user-name">
                            <div className="menu-name w-inline-block">
                            <div className={"report-name "+ (this.state.selectedUser === false ? "active":"")} onClick={this.selectUser.bind(this,false)}>Group</div>
                            </div>
                            {this.props.users &&
                                this.props.users.map((user) =>
                                <div className="menu-name w-inline-block cursor-pointer" key={user._id} onClick={this.selectUser.bind(this,user._id)}>
                                {user.profile.firstName && user.profile.lastName 
                                    ?
                                    <div className={"report-name "+ (this.state.selectedUser == user._id ? "active":"")}>
                                        {user.profile.firstName}&nbsp;{user.profile.lastName}
                                    </div>
                                    :
                                    <div className={"report-name "+ (this.state.selectedUser == user._id ? "active":"")}>{user.emails[0].address}</div>
                                }
                                
                                </div>
                            )
                            }
                        </div>
                        <div className="report-content">
                            <div className="report-active">
                                {this.state.selectedUser 
                                    ?
                                    <div className="container-2 w-container">
                                        <div className="a4">
                                        {this.state.loadingPreview 
                                            ?
                                            <div className="weq-bg white-bg-color pdf-preview-loading">
                                                <div className="w-block noselect">
                                                    <div className="font-rate padding-wrapper">
                                                        Please wait...
                                                    </div>
                                                </div>
                                            </div>
                                            :this.state.preview 
                                                ?<img src={this.state.preview} alt="preview" width="300" height="420"/>
                                                :"error loading preview"
                                        }
                                        </div>
                                        {this.state.generatingPdf 
                                        ?
                                            <div className="pdf-download-wrapper">
                                                <div className="pdf-download-bttn w-inline-block w-clearfix noselect">
                                                Please wait....
                                                </div>
                                            </div>
                                        :
                                            <div className="pdf-download-wrapper">
                                                <select className="w-select w-inline-block pdf-download-lang-select" 
                                                name="language" value={this.state.downloadIndividualLang} onChange={this.handleChangeIndividualLang.bind(this)}>
                                                    {this.renderLanguageList()}
                                                </select>
                                                <div className="pdf-download-bttn w-inline-block w-clearfix cursor-pointer" onClick={this.downloadPdf.bind(this)}>
                                                Download
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    :
                                    <div className="container-2 w-container">
                                        <div className="a4">
                                            <img src="/img/report/group-preview.jpg" alt="preview" width="300" height="420"/>
                                        </div>

                                        {this.state.generatingPdf 
                                        ?
                                            <div className="pdf-download-wrapper">
                                                <div className="pdf-download-bttn w-inline-block w-clearfix noselect">
                                                Please wait....
                                                </div>
                                            </div>
                                        :
                                            <div className="pdf-download-wrapper">

                                                <select className="w-select w-inline-block pdf-download-lang-select" name="language"
                                                value={this.state.downloadAllLang} onChange={this.handleChangeAllLang.bind(this)}>
                                                    {this.renderLanguageList()}
                                                </select>
                                                <div className="pdf-download-bttn w-inline-block w-clearfix cursor-pointer" onClick={this.downloadPdfMulti.bind(this)}>
                                                Download
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                );
            }
            else{
                <div className="fillHeight">
                  <div className="emptytext group">group not found</div>
                </div>
            }
            
        }else{
            return(
                <div className="fillHeight">
                  <Loading/>
                </div>
            );
        }
    }
}

export default withTracker((props) => {
    var dataReady;
    var group;
    var users;
    var handleGroup;
      if(props.groupId){
          handleGroup = Meteor.subscribe('group',{_id : props.groupId},{}, {
            onError: function (error) {
                  console.log(error);
              }
          });
  
          if(handleGroup.ready()){
            group = Group.findOne({_id : props.groupId});
            users = Meteor.users.find(
            {
                "_id" : {$in:group.userIds}
            }
            ).fetch();
            dataReady = true;
          }
      }
    return {
        users:users,
        group:group,
        currentUser: Meteor.user(),
        dataReady:dataReady
    };
  })(GroupReportPage);