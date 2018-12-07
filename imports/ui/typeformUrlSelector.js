import React from 'react';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export function typeformUrlSelector(type){
    //get locale and language code
    var locale = i18n.getLocale();
    var languageCode = locale.split("-")[0];

    var formIdTest = Meteor.settings.public.typeformTestFormCode;
    var formIdProd =  Meteor.settings.public.typeformProdFormCode;

    if(type=="url"){
        var typeformUrl;

        if(window.location.hostname == "app.weq.io"){
            //production
            typeformUrl = `https://oh2.typeform.com/to/${formIdProd[languageCode]}`;

            //if language code is not supported, use the english typeform as default.
            if(!typeformUrl){
                typeformUrl = `https://oh2.typeform.com/to/${formIdProd["en"]}`;
            }
        }else{
            //test
            typeformUrl = `https://oh2.typeform.com/to/${formIdTest[languageCode]}`;

            //if language code is not supported, use the english typeform as default.
            if(!typeformUrl){
                typeformUrl = `https://oh2.typeform.com/to/${formIdTest["en"]}`;
            }
        }

        return typeformUrl;
    }else{
        var formId;
        if(window.location.hostname == "app.weq.io"){
            formId = formIdProd[languageCode];

            if(!formId){
                formId = formIdProd["en"];
            }
        }else{
            formId = formIdTest[languageCode];

            if(!formId){
                formId = formIdTest["en"];
            }
        }

        return formId;
    }
}   