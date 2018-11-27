import { Meteor } from 'meteor/meteor'
import i18n from 'meteor/universe:i18n';

export function getDefaultLocale(){
    if(Meteor.isCordova){
        return i18n.getLocale();
    }else{
        return (
            navigator.languages && navigator.languages[0] ||
            navigator.language ||
            navigator.browserLanguage ||
            navigator.userLanguage ||
            i18n.getLocale()
        );
    }
}