import React from 'react';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export function calculateChartLineWidth(maxValue, minValue){
    var result = Number.parseFloat((maxValue-minValue)*100/6).toPrecision(3) - 3;
    if(result < 0){
        result = 0;
    }
    return result;
}