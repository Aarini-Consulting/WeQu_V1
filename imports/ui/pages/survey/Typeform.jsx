import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import * as typeformEmbed from '@typeform/embed';

import Menu from '/imports/ui/pages/menu/Menu';

import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class NotFound extends React.Component {
    componentDidMount(){
        var el = ReactDOM.findDOMNode(this.refs.typeform);

        if(el){
            //   When instantiating a widget embed, you must provide the DOM element
            //   that will contain your typeform, the URL of your typeform, and your
            //   desired embed settings
            var typeformUrl;

            //get locale and language code
            var locale = i18n.getLocale();
            var languageCode = locale.split("-")[0];
            
            var urlProd = {
              "en":'https://oh2.typeform.com/to/RzcwbL',
              "nl":'https://oh2.typeform.com/to/oLBtn6'
            }

            var urlTest = {
              "en":'https://oh2.typeform.com/to/xPDY7T',
              "nl":'https://oh2.typeform.com/to/OAKojL'
            }

            if(window.location.hostname == "app.weq.io"){
              //production
              typeformUrl = urlProd[languageCode];

              //if language code is not supported, use the english typeform as default.
              if(!typeformUrl){
                typeformUrl= urlProd["en"];
              }
            }else{
              //test
              typeformUrl = urlTest[languageCode];

              //if language code is not supported, use the english typeform as default.
              if(!typeformUrl){
                typeformUrl= urlTest["en"];
              }
            }
            typeformEmbed.makeWidget(el, typeformUrl, {
                hideFooter: true,
                hideHeaders: true,
                opacity: 0,
                onSubmit:this.props.onSubmitCallback
            });
        }
    }
    
    render() {
      return (
        <div className="fillHeight" style={{height:100+"vh"}}>
          <section style={{height:100+"%"}}ref="typeform">
          </section>
        </div>
      );
    }
  }
  