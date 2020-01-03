import React from 'react';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export function complexLinkTranslate(name, params){
    var locale = i18n.getLocale();
    var languageCode = locale.split("-")[0];

    if(languageCode == "en"){
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
    }else if(languageCode == "nl"){
            var translation = {
            "settings.accountTypeAds":
                <React.Fragment>
                    Wilt u uw eigen WeQ-sessie faciliteren? Kijk of u gekwalificeerd bent voor ons <a href="https://www.weq.io/Become-a-WeQ-Certified-Master-Coach" target="_blank">Certified Coach-trainingsprogramma</a>
                </React.Fragment>,
            "settings.consentTerms":
                <React.Fragment>
                    Ik heb de <a href="https://www.weq.io/policy/weq-app-terms-and-conditions" target="_blank" id="terms">algemene voorwarden</a> en <a href="https://www.weq.io/policy/weq-app-data-process-and-privacy-policy" target="_blank" id="privacyPolicy">privacybeleid</a> gelezen en ga hiermee akkoord.
                </React.Fragment>,
            "settings.consentCMC":
                <React.Fragment>
                    Ik heb de <a href="https://www.weq.io/policy/certified-master-coach-terms-and-conditions" target="_blank" id="terms">Certified Master Coach voorwarden</a> gelezen en ga hiermee akkoord.
                </React.Fragment>,
            "reportPdf.OpeningParagraph":
                <React.Fragment>
                    U hebt zojuist WeQ met <strong>{params && params.groupName}</strong> gespeeld. 
                    Dit is uw rapport opgesteld door <strong>{params && params.groupCreatorFirstName}&nbsp;{params && params.groupCreatorLastName}</strong>, WeQ Master Coach
                </React.Fragment>,
            "quizRankSelf.PopUp":
                <React.Fragment>
                    Beschrijf Uzelf
                    <br/>
                    <br/>
                    Welke kwaliteiten passen het best bij u?<br/>
                    Sorteer de volgende woorden van boven naar beneden door ze omhoog of omlaag in de lijst te slepen.<br/>
                    <br/>
                    U hebt 60 seconden.
                </React.Fragment>,
            "quizRankPage.FinishMessage":
                <React.Fragment>
                    KLAAR!
                    <br/><br/>
                    Bedankt voor het invullen van de enquête.
                    <br/><br/>
                    U zult deze app de volgende keer dat u WeQ speelt weer nodig hebben,<br/>
                    vergeet dus niet <b>uw telefoon mee te nemen naar de sessie!</b>
                    <br/>
                    <br/>
                </React.Fragment>
            }
        return translation[name];
    }
    else if(languageCode == "fr"){
        var translation = {
            "settings.accountTypeAds":
                <React.Fragment>
                    Voulez-vous animer votre propre session WeQ ? Voyez si vous êtes qualifié pour <a href="https://www.weq.io/Become-a-WeQ-Certified-Master-Coach" target="_blank"> notre programme de formation de coach certifié</a>
                </React.Fragment>,
            "settings.consentTerms":
                <React.Fragment>
                    J'ai lu et j'accepte les <a href="https://www.weq.io/policy/weq-app-terms-and-conditions" target="_blank" id="terms">conditions d'utilisation</a> et la <a href="https://www.weq.io/policy/weq-app-data-process-and-privacy-policy" target="_blank" id="privacyPolicy">politique de confidentialité</a>.
                </React.Fragment>,
            "settings.consentCMC":
                <React.Fragment>
                    J'ai lu et j'accepte les <a href="https://www.weq.io/policy/certified-master-coach-terms-and-conditions" target="_blank" id="terms">conditions générales du Master Coach certifié</a>
                </React.Fragment>,
            "reportPdf.OpeningParagraph":
                <React.Fragment>
                    Vous venez de jouer à WeQ avec <strong>{params && params.groupName}</strong>. 
                    Ceci est votre compte-rendu préparé par <strong>{params && params.groupCreatorFirstName}&nbsp;{params && params.groupCreatorLastName}</strong>, Master Coach WeQ.
                </React.Fragment>,
            "quizRankSelf.PopUp":
                <React.Fragment>
                    Décrivez-vous
                    <br/>
                    <br/>
                    Quelles qualités s’appliquent le plus à vous ? <br/>
                    Classez les mots suivants de haut en bas en les faisant glisser vers le haut ou le bas de la liste.<br/>
                    <br/>
                    Vous avez 60 secondes.
                </React.Fragment>,
            "quizRankPage.FinishMessage":
                <React.Fragment>
                    TERMINÉ !
                    <br/><br/>
                    Merci d'avoir répondu aux questions. 
                    <br/><br/>
                    Vous utiliserez cette application à nouveau lorsque vous jouerez à WeQ,<br/>
                    alors n'oubliez pas <b>d'apporter votre téléphone à chaque session !</b>
                    <br/>
                    <br/>
                </React.Fragment>
        }
        return translation[name];
    } 
    else if(languageCode == "de"){
        var translation = {
            "settings.accountTypeAds":
                <React.Fragment>
                    Wollen Sie Ihre eigene WeQ Veranstaltung ausrichten? Schauen Sie ob Sie sich qualifizieren für unsere <a href="https://www.weq.io/Become-a-WeQ-Certified-Master-Coach" target="_blank">{i18n.getTranslation("weq.settings.AccountTypeAdsCMC")}</a>
                </React.Fragment>,
            "settings.consentTerms":
                <React.Fragment>
                    Ich habe gelesen, verstehe und akzeptiere die <a href="https://www.weq.io/policy/weq-app-terms-and-conditions" target="_blank" id="terms">Bedingungen</a> und <a href="https://www.weq.io/policy/weq-app-data-process-and-privacy-policy" target="_blank" id="privacyPolicy">Datenschutzrichtlinien</a>.
                </React.Fragment>,
            "settings.consentCMC":
                <React.Fragment>
                    Ich habe gelesen, verstehe und akzeptiere die <a href="https://www.weq.io/policy/certified-master-coach-terms-and-conditions" target="_blank" id="terms">Certified Master Coach Allgemeine Geschäftsbedingungen</a>.
                </React.Fragment>,
            "reportPdf.OpeningParagraph":
                <React.Fragment>
                    Du hast gerade WeQ gespielt mit <strong>{params && params.groupName}</strong>. 
                    Dieser Report wurde erstellt von <strong>{params && params.groupCreatorFirstName}&nbsp;{params && params.groupCreatorLastName}</strong>, WeQ Master Coach.
                </React.Fragment>,
            "quizRankSelf.PopUp":
                <React.Fragment>
                    Beschreiben Sie sich selbst
                    <br/>
                    <br/>
                    Welchen Eigenschaften entsprechen Sie am meisten?<br/>
                    Sortieren Sie die nächsten Worte in der Liste von oben nach unten mittels „drag and drop“<br/>
                    <br/>
                    Sie haben 60 Sekunden Zeit.
                </React.Fragment>,
            "quizRankPage.FinishMessage":
                <React.Fragment>
                    Fertig!
                    <br/><br/>
                    Vielen dank, dass Sie an der Umfrage teilgenommen haben.
                    <br/><br/>
                    Sie werden diese App wieder benutzen wenn Sie WeQ spielen,<br/>
                    also vergessen Sie nicht <b>Ihr Telefon zur Veranstaltung zu bringen</b>. 
                    <br/>
                    <br/>
                </React.Fragment>
        }
    return translation[name];
    }
    else if(languageCode == "es" || languageCode == "es-AR" || languageCode == "es-ES"){
        var translation = {
            "settings.accountTypeAds":
                <React.Fragment>
                    ¿Quieres facilitar tu propia sesión de WeQ? Vea si está calificado para nuestro <a href="https://www.weq.io/Become-a-WeQ-Certified-Master-Coach" target="_blank">{i18n.getTranslation("weq.settings.AccountTypeAdsCMC")}</a>
                </React.Fragment>,
            "settings.consentTerms":
                <React.Fragment>
                    He leído y estoy de acuerdo con <a href="https://www.weq.io/policy/weq-app-terms-and-conditions" target="_blank" id="terms">Condiciones</a> y <a href="https://www.weq.io/policy/weq-app-data-process-and-privacy-policy" target="_blank" id="privacyPolicy">Política de privacidad</a>.
                </React.Fragment>,
            "settings.consentCMC":
                <React.Fragment>
                    He leído y estoy de acuerdo con <a href="https://www.weq.io/policy/certified-master-coach-terms-and-conditions" target="_blank" id="terms">Certified Master Coach Terms and Conditions</a>.
                </React.Fragment>,
            "reportPdf.OpeningParagraph":
                <React.Fragment>
                    Acabas de jugar WeQ con tu <strong>{params && params.groupName}</strong>. 
                    Este es su informe preparado por <strong>{params && params.groupCreatorFirstName}&nbsp;{params && params.groupCreatorLastName}</strong>, WeQ Master Coach.
                </React.Fragment>,
            "quizRankSelf.PopUp":
                <React.Fragment>
                    Describete
                    <br/>
                    <br/>
                    ¿Qué cualidades son más ciertas sobre ti?<br/>
                    Ordene las siguientes palabras de arriba a abajo arrastrándolas hacia arriba o hacia abajo en la lista.<br/>
                    <br/>
                    Tienes 60 segundos
                </React.Fragment>,
            "quizRankPage.FinishMessage":
                <React.Fragment>
                    ¡HECHO!
                    <br/><br/>
                    Gracias por completar la encuesta.
                    <br/><br/>
                    Volverás a usar esta aplicación cuando juegues a WeQ,<br/>
                    ¡así que recuerda traer <b>tu teléfono a la sesión!</b> 
                    <br/>
                    <br/>
                </React.Fragment>
        }
    return translation[name];
    }
}