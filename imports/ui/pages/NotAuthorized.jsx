import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class NotAuthorized extends React.Component {
    render() {
      return (
        <section className="gradient1 whiteText alignCenter feed">
            <div className="am-wrapper am-error am-error-404">
                <div className="am-content">
                <div className="main-content">
                    <div className="error-container">
                    <div className="error-image"></div>
                        <br/> <br/>
                    <div className="error-number">401</div>
                    <p className="error-description">Auth error.</p>
                    <div className="error-goback-text">Would you like to go <Link to="/">Home</Link>?</div>
                        <br/> <br/>
                    <div className="footer">&copy; 2018 <Link to="/">WeQ</Link></div>
                    </div>
                </div>
                </div>
            </div>
        </section>
      );
    }
  }
  