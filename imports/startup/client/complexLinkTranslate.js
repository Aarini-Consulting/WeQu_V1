import React from 'react';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export function complexLinkTranslate(name){
    var locale = i18n.getLocale();
    if(locale == "en-US"){
            var translation = {
                "settings.accountTypeAds":
                    <React.Fragment>
                        Do you want to facilitate your own WeQ session? See if you're qualified for our <a href="https://www.weq.io/Become-a-WeQ-Certified-Master-Coach" target="_blank">{i18n.getTranslation("weq.settings.AccountTypeAdsCMC")}</a>
                    </React.Fragment>,
                "settings.consentTerms":
                    <React.Fragment>
                        I have read and agree to the <a href="https://www.weq.io/policy/weq-app-terms-and-conditions" target="_blank" id="terms">Terms</a> and <a href="https://www.weq.io/policy/weq-app-data-process-and-privacy-policy" target="_blank" id="privacyPolicy">Privacy Policy</a>.
                    </React.Fragment>,
                "settings.consentCMC":
                    <React.Fragment>
                        I have read and agree to the <a href="https://www.weq.io/policy/certified-master-coach-terms-and-conditions" target="_blank" id="terms">Certified Master Coach Terms and Conditions</a>.
                    </React.Fragment>
            }
        return translation[name];
    }else if(locale == "nl-NL"){
            var translation = {
            "settings.accountTypeAds":
                <React.Fragment>
                    Wilt u je eigen WeQ-sessie houden? Kijk naar onze <a href="https://www.weq.io/Become-a-WeQ-Certified-Master-Coach" target="_blank">{i18n.getTranslation("weq.settings.AccountTypeAdsCMC")}</a>
                </React.Fragment>,
            "settings.consentTerms":
                <React.Fragment>
                    Ik heb de <a href="https://www.weq.io/policy/weq-app-terms-and-conditions" target="_blank" id="terms">algemene voorwarden</a> en <a href="https://www.weq.io/policy/weq-app-data-process-and-privacy-policy" target="_blank" id="privacyPolicy">privacybeleid</a> gelezen en ik ga hiermee akkoord.
                </React.Fragment>,
            "settings.consentCMC":
                <React.Fragment>
                    Ik heb de <a href="https://www.weq.io/policy/certified-master-coach-terms-and-conditions" target="_blank" id="terms">Certified Master Coach voorwarden</a> gelezen en ik ga hiermee akkoord.
                </React.Fragment>
            }
        return translation[name];
    }
    
}