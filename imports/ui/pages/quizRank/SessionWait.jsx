import React from 'react';
import { Link } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';

export default class SessionWait extends React.Component {
  render() {
    return (
        <div className="flex-column-fill-center weq-bg">
             <div className="ring"></div>
        </div>
    );
  }
}
