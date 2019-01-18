import React from 'react';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export function complexLinkTranslate(name, params){
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
                    </React.Fragment>,
                "reportPdf.OpeningParagraph":
                    <React.Fragment>
                        You&#x27;ve just played WeQ with your <strong>{params && params.groupName}</strong>. 
                        This is your report prepared by <strong>{params && params.groupCreatorFirstName}&nbsp;{params && params.groupCreatorLastName}</strong>, WeQ Master Coach.
                    </React.Fragment>,
                "quizRankSelf.PopUp":
                    <React.Fragment>
                        Describe Yourself
                        <br/>
                        <br/>
                        Which qualities are most true about you?<br/>
                        Sort the following words from top to bottom by dragging them up or down in the list.<br/>
                        <br/>
                        You have 60 seconds.
                    </React.Fragment>,
                "quizRankPage.FinishMessage":
                    <React.Fragment>
                        DONE!
                        <br/><br/>
                        Thank you for completing the survey. 
                        <br/><br/>
                        You will use this app again when you play WeQ,<br/>
                        so remember to <b>bring your phone to the session!</b> 
                        <br/>
                        <br/>
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
                </React.Fragment>,
            "reportPdf.OpeningParagraph":
                <React.Fragment>
                    U heeft net WeQ met uw <strong>{params && params.groupName}</strong> Team gespeeld. 
                    Dit is uw rapport die door <strong>{params && params.groupCreatorFirstName}&nbsp;{params && params.groupCreatorLastName}</strong> WeQ Master Coach is opgesteld
                </React.Fragment>,
            "quizRankSelf.PopUp":
                <React.Fragment>
                    Describe Yourself
                    <br/>
                    <br/>
                    Which qualities are most true about you?<br/>
                    Sort the following words from top to bottom by dragging them up or down in the list.<br/>
                    <br/>
                    You have 60 seconds.
                </React.Fragment>,
            "quizRankPage.FinishMessage":
                <React.Fragment>
                    DONE!
                    <br/><br/>
                    Thank you for completing the survey. 
                    <br/><br/>
                    You will use this app again when you play WeQ,<br/>
                    so remember to <b>bring your phone to the session!</b> 
                    <br/>
                    <br/>
                </React.Fragment>
            }
        return translation[name];
    }
    else if(locale == "fr-FR"){
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
                </React.Fragment>,
            "reportPdf.OpeningParagraph":
                <React.Fragment>
                    You&#x27;ve just played WeQ with your <strong>{params && params.groupName}</strong>. 
                    This is your report prepared by <strong>{params && params.groupCreatorFirstName}&nbsp;{params && params.groupCreatorLastName}</strong>, WeQ Master Coach.
                </React.Fragment>,
            "quizRankSelf.PopUp":
                <React.Fragment>
                    Describe Yourself
                    <br/>
                    <br/>
                    Which qualities are most true about you?<br/>
                    Sort the following words from top to bottom by dragging them up or down in the list.<br/>
                    <br/>
                    You have 60 seconds.
                </React.Fragment>,
            "quizRankPage.FinishMessage":
                <React.Fragment>
                    DONE!
                    <br/><br/>
                    Thank you for completing the survey. 
                    <br/><br/>
                    You will use this app again when you play WeQ,<br/>
                    so remember to <b>bring your phone to the session!</b> 
                    <br/>
                    <br/>
                </React.Fragment>
        }
        return translation[name];
    }
}