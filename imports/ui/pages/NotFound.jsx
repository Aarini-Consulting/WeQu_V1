import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class NotFound extends React.Component {
    render() {
      return (
        <section className="gradient1 whiteText alignCenter feed">
            <div className="am-wrapper am-error am-error-404">
                <div className="am-content">
                <div className="main-content">
                    <div className="error-container">
                    <div className="error-image"></div>
                        <br/> <br/>
                    <div className="error-number">404</div>
                    <p className="error-description">The page you are looking for might have been removed.</p>
                    <div className="error-goback-text">Would you like to go <Link to="/">Home</Link>?</div>
                        <br/> <br/>
                    <div className="footer">&copy; 2017 <Link to="/">WEQU</Link></div>
                    </div>
                </div>
                </div>
            </div>
        </section>
      );
    }
  }
  