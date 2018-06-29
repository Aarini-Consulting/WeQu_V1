import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Loading from '/imports/ui/pages/loading/Loading';
import Report from '/imports/ui/pages/group/Report';

class GroupReportPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
          selectedUser:false,
          preview:undefined,
          loadingPreview:false,
          generatingPdf:false
        }
    }
    downloadPdfMulti(){
        this.setState({ generatingPdf: true });
        Meteor.call('download.report.group.pdf',this.props.group._id, (error, response) => {
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
        Meteor.call('download.report.individual.pdf',this.props.group._id, this.state.selectedUser, (error, response) => {
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
            this.generatePreview();
        });
    }
    generatePreview(){
        Meteor.call('generate.preview',this.props.group._id, this.state.selectedUser, (error, response) => {
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
    render() {
        if(this.props.dataReady){
            return (
                <div>
                    <div className="user-name">
                        <div className="menu-name w-inline-block">
                        <div className="report-name" onClick={this.selectUser.bind(this,false)}>All</div>
                        </div>
                        {this.props.users &&
                            this.props.users.map((user) =>
                            <div className="menu-name w-inline-block cursor-pointer" key={user._id} onClick={this.selectUser.bind(this,user._id)}>
                            <div className="report-name">{user.profile.firstName}&nbsp;{user.profile.lastName}</div>
                            </div>
                        )
                        }
                    </div>
                    <div className="report-content">
                        <div className="report-active">
                        {this.state.selectedUser 
                            ?
                            <div className="container-2 w-container">
                                <br/>
                                <div className="a4">
                                {this.state.loadingPreview 
                                    ?
                                    "loading preview"
                                    :this.state.preview 
                                        ?<img src={this.state.preview} alt="preview" width="300" height="420"/>
                                        :"error loading preview"
                                }
                                </div>
                                {this.state.generatingPdf 
                                ?
                                    "loading"
                                :
                                    <div className="pdf-download-bttn w-inline-block w-clearfix cursor-pointer" onClick={this.downloadPdf.bind(this)}>
                                    Download Individual Report
                                    </div>
                                }
                            </div>
                            :
                            <div className="container-2 w-container">
                                <br/>
                                {this.state.generatingPdf 
                                ?
                                    "loading"
                                :
                                    <a className="pdf-download-bttn w-inline-block w-clearfix cursor-pointer" onClick={this.downloadPdfMulti.bind(this)}>
                                    Download All Report
                                    </a>
                                }
                            </div>
                        }
                        </div>
                    </div>
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
                $or : [ {"emails.address" : {$in:group.emails}  }, 
                { "profile.emailAddress" : {$in:group.emails}}]
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