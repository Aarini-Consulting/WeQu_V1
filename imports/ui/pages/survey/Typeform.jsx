import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import * as typeformEmbed from '@typeform/embed';

import Menu from '/imports/ui/pages/menu/Menu';

import i18n from 'meteor/universe:i18n';

import {typeformUrlSelector} from '/imports/ui/typeformUrlSelector';

const T = i18n.createComponent();

export default class Typeform extends React.Component {
    componentDidMount(){
        var el = ReactDOM.findDOMNode(this.refs.typeform);

        if(el){
          //   When instantiating a widget embed, you must provide the DOM element
          //   that will contain your typeform, the URL of your typeform, and your
          //   desired embed settings
          typeformEmbed.makeWidget(el, typeformUrlSelector("url",this.props.groupLanguage), {
            hideFooter: true,
            hideHeaders: true,
            opacity: 0,
            onSubmit:this.props.onSubmitCallback
          });
        }
    }
    
    render() {
      return (
        <div className="fillHeight" style={{height:100+"%"}}>
          <section style={{height:100+"%",overflow:"auto"}}ref="typeform">
          </section>
        </div>
      );
    }
  }
  