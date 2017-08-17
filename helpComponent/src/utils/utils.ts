import { DatePipe } from '@angular/common';
import { Constants } from './constans';
import { FormGroup, FormControl } from '@angular/forms';
import { IMyDate } from 'mydatepicker';
import { TimeInterface } from '../components/interfaces/dateTime.interface';
import { LoadingOptions } from 'ionic-angular';

export function getFormattedDate(date): string {
    return new DatePipe(Constants.LOCALE).transform(date, 'shortDate');
}

export function getFormattedTime(time: TimeInterface): string {
    let isNullOrUndefinedOrSpace: Function = function (val: any): boolean {
        return (val === null || val === undefined || val === '');
    }

    if (!time || isNullOrUndefinedOrSpace(time.hh) || isNullOrUndefinedOrSpace(time.mm)) {
        return '';
    }

    let addLeadingZero: Function = function (num: number): string {
        let prefix: string = num < 10 ? '0' : '';
        return prefix + num;
    }

    return addLeadingZero(time.hh) + ":" + addLeadingZero(time.mm);
}


export function markAllFormControlsAsTouched(form: FormGroup): void {
    if (!form) {
        return;
    }

    for (let name in form.controls) {
        (<FormControl>form.controls[name]).markAsTouched();
    }
}

export function filterDigitsOnly(event: KeyboardEvent): boolean {
    const keyCode = event.keyCode;
    return (keyCode >= 48 && keyCode <= 57);
}

export function isNumber(value: any) {
    return (value != undefined && value != null && value.toString().length > 0 && value.toString().match(/[^0-9\.\-]/g) == null);
}

export function isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
}

//Return the language of the locale. For example for "en-US" the returned value is "en""
export function getLocaleLanguage() {
    let lang = 'en';
    try {
        lang = navigator.language.split("-")[0];
    }
    catch (exception) { }

    return lang;
}

// Returns an inner object property.
// For example let obj = { a: { b: "val" } }
// For given property = "a.b" the function will return "val"
export function getInnerObjectProperty(obj: Object, property: string, formatter?: Function): any {
    if (!obj) {
        return undefined;
    }

    let propertiesArr = property.split('.');
    let value: any;

    value = obj;
    for (let i = 0; i < propertiesArr.length; i++) {
        value = value[propertiesArr[i]];
        if (value === undefined || value === null) {
            break;
        }
    }
    return formatter ? formatter(value) : value;
}

//Converts string or number date representation to Date object
export function toDate(date: any): Date {
    if (!date) {
        return undefined;
    }

    if (date instanceof Date) {
        return date;
    }
    else {
        return new Date(date);
    }
}

//Converts date object to IMyDate
export function dateObjectToIMyDate(date: Date): IMyDate {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

//Returns default LoadingOptions for LoadingController (spinner)
export function getDefaultLoadinOptions(): LoadingOptions {
    return {
        spinner: 'crescent',
        showBackdrop: true,
        cssClass: 'activity-detail-loading',
        duration: 10000
    }
}

//Returns the short date format pattern according to the locale
export function getLocaleShortDatePatternString(): string {
    let formats = {
        "ar-SA": "dd/mm/yy",
        "bg-BG": "dd.mm.yyyy",
        "ca-ES": "dd/mm/yyyy",
        "zh-TW": "yyyy/mm/dd",
        "cs-CZ": "dd.mm.yyyy",
        "da-DK": "dd-mm-yyyy",
        "de-DE": "dd.mm.yyyy",
        "el-GR": "d/mm/yyyy",
        "en-US": "mm/dd/yyyy",
        "fi-FI": "dd.mm.yyyy",
        "fr-FR": "dd/mm/yyyy",
        "he-IL": "dd/mm/yyyy",
        "hu-HU": "yyyy. mm. dd.",
        "is-IS": "dd.mm.yyyy",
        "it-IT": "dd/mm/yyyy",
        "ja-JP": "yyyy/mm/dd",
        "ko-KR": "yyyy-mm-dd",
        "nl-NL": "dd-mm-yyyy",
        "nb-NO": "dd.mm.yyyy",
        "pl-PL": "yyyy-mm-dd",
        "pt-BR": "d/mm/yyyy",
        "ro-RO": "dd.mm.yyyy",
        "ru-RU": "dd.mm.yyyy",
        "hr-HR": "dd.mm.yyyy",
        "sk-SK": "dd. M. yyyy",
        "sq-AL": "yyyy-mm-dd",
        "sv-SE": "yyyy-mm-dd",
        "th-TH": "d/mm/yyyy",
        "tr-TR": "dd.mm.yyyy",
        "ur-PK": "dd/mm/yyyy",
        "id-ID": "dd/mm/yyyy",
        "uk-UA": "dd.mm.yyyy",
        "be-BY": "dd.mm.yyyy",
        "sl-SI": "dd.mm.yyyy",
        "et-EE": "dd.mm.yyyy",
        "lv-LV": "yyyy.mm.dd.",
        "lt-LT": "yyyy.mm.dd",
        "fa-IR": "mm/ddd/yyyy",
        "vi-VN": "dd/mm/yyyy",
        "hy-AM": "dd.mm.yyyy",
        "az-Latn-AZ": "dd.mm.yyyy",
        "eu-ES": "yyyy/mm/ddd",
        "mk-MK": "dd.mm.yyyy",
        "af-ZA": "yyyy/mm/ddd",
        "ka-GE": "dd.mm.yyyy",
        "fo-FO": "dd-mm-yyyy",
        "hi-IN": "dd-mm-yyyy",
        "ms-MY": "dd/mm/yyyy",
        "kk-KZ": "dd.mm.yyyy",
        "ky-KG": "dd.mm.yy",
        "sw-KE": "mm/dd/yyyy",
        "uz-Latn-UZ": "dd/mm yyyy",
        "tt-RU": "dd.mm.yyyy",
        "pa-IN": "dd-mm-yy",
        "gu-IN": "dd-mm-yy",
        "ta-IN": "dd-mm-yyyy",
        "te-IN": "dd-mm-yy",
        "kn-IN": "dd-mm-yy",
        "mr-IN": "dd-mm-yyyy",
        "sa-IN": "dd-mm-yyyy",
        "mn-MN": "yy.mm.dd",
        "gl-ES": "dd/mm/yy",
        "kok-IN": "dd-mm-yyyy",
        "syr-SY": "dd/mm/yyyy",
        "dv-MV": "dd/mm/yy",
        "ar-IQ": "dd/mm/yyyy",
        "zh-CN": "yyyy/mm/dd",
        "de-CH": "dd.mm.yyyy",
        "en-GB": "dd/mm/yyyy",
        "es-MX": "dd/mm/yyyy",
        "fr-BE": "d/mm/yyyy",
        "it-CH": "dd.mm.yyyy",
        "nl-BE": "d/mm/yyyy",
        "nn-NO": "dd.mm.yyyy",
        "pt-PT": "dd-mm-yyyy",
        "sr-Latn-CS": "dd.mm.yyyy",
        "sv-FI": "dd.mm.yyyy",
        "az-Cyrl-AZ": "dd.mm.yyyy",
        "ms-BN": "dd/mm/yyyy",
        "uz-Cyrl-UZ": "dd.mm.yyyy",
        "ar-EG": "dd/mm/yyyy",
        "zh-HK": "d/mm/yyyy",
        "de-AT": "dd.mm.yyyy",
        "en-AU": "d/mm/yyyy",
        "es-ES": "dd/mm/yyyy",
        "fr-CA": "yyyy-mm-dd",
        "sr-Cyrl-CS": "dd.mm.yyyy",
        "ar-LY": "dd/mm/yyyy",
        "zh-SG": "d/mm/yyyy",
        "de-LU": "dd.mm.yyyy",
        "en-CA": "dd/mm/yyyy",
        "es-GT": "dd/mm/yyyy",
        "fr-CH": "dd.mm.yyyy",
        "ar-DZ": "dd-mm-yyyy",
        "zh-MO": "d/mm/yyyy",
        "de-LI": "dd.mm.yyyy",
        "en-NZ": "d/mm/yyyy",
        "es-CR": "dd/mm/yyyy",
        "fr-LU": "dd/mm/yyyy",
        "ar-MA": "dd-mm-yyyy",
        "en-IE": "dd/mm/yyyy",
        "es-PA": "mm/ddd/yyyy",
        "fr-MC": "dd/mm/yyyy",
        "ar-TN": "dd-mm-yyyy",
        "en-ZA": "yyyy/mm/ddd",
        "es-DO": "dd/mm/yyyy",
        "ar-OM": "dd/mm/yyyy",
        "en-JM": "dd/mm/yyyy",
        "es-VE": "dd/mm/yyyy",
        "ar-YE": "dd/mm/yyyy",
        "en-029": "mm/ddd/yyyy",
        "es-CO": "dd/mm/yyyy",
        "ar-SY": "dd/mm/yyyy",
        "en-BZ": "dd/mm/yyyy",
        "es-PE": "dd/mm/yyyy",
        "ar-JO": "dd/mm/yyyy",
        "en-TT": "dd/mm/yyyy",
        "es-AR": "dd/mm/yyyy",
        "ar-LB": "dd/mm/yyyy",
        "en-ZW": "mm/dd/yyyy",
        "es-EC": "dd/mm/yyyy",
        "ar-KW": "dd/mm/yyyy",
        "en-PH": "mm/dd/yyyy",
        "es-CL": "dd-mm-yyyy",
        "ar-AE": "dd/mm/yyyy",
        "es-UY": "dd/mm/yyyy",
        "ar-BH": "dd/mm/yyyy",
        "es-PY": "dd/mm/yyyy",
        "ar-QA": "dd/mm/yyyy",
        "es-BO": "dd/mm/yyyy",
        "es-SV": "dd/mm/yyyy",
        "es-HN": "dd/mm/yyyy",
        "es-NI": "dd/mm/yyyy",
        "es-PR": "dd/mm/yyyy",
        "am-ET": "d/mm/yyyy",
        "tzm-Latn-DZ": "dd-mm-yyyy",
        "iu-Latn-CA": "d/mm/yyyy",
        "sma-NO": "dd.mm.yyyy",
        "mn-Mong-CN": "yyyy/mm/dd",
        "gd-GB": "dd/mm/yyyy",
        "en-MY": "d/mm/yyyy",
        "prs-AF": "dd/mm/yy",
        "bn-BD": "dd-mm-yy",
        "wo-SN": "dd/mm/yyyy",
        "rw-RW": "mm/dd/yyyy",
        "qut-GT": "dd/mm/yyyy",
        "sah-RU": "mm.dd.yyyy",
        "gsw-FR": "dd/mm/yyyy",
        "co-FR": "dd/mm/yyyy",
        "oc-FR": "dd/mm/yyyy",
        "mi-NZ": "dd/mm/yyyy",
        "ga-IE": "dd/mm/yyyy",
        "se-SE": "yyyy-mm-dd",
        "br-FR": "dd/mm/yyyy",
        "smn-FI": "dd.mm.yyyy",
        "moh-CA": "mm/dd/yyyy",
        "arn-CL": "dd-mm-yyyy",
        "ii-CN": "yyyy/mm/dd",
        "dsb-DE": "dd. M. yyyy",
        "ig-NG": "d/mm/yyyy",
        "kl-GL": "dd-mm-yyyy",
        "lb-LU": "dd/mm/yyyy",
        "ba-RU": "dd.mm.yy",
        "nso-ZA": "yyyy/mm/ddd",
        "quz-BO": "dd/mm/yyyy",
        "yo-NG": "d/mm/yyyy",
        "ha-Latn-NG": "d/mm/yyyy",
        "fil-PH": "mm/dd/yyyy",
        "ps-AF": "dd/mm/yy",
        "fy-NL": "dd-mm-yyyy",
        "ne-NP": "mm/dd/yyyy",
        "se-NO": "dd.mm.yyyy",
        "iu-Cans-CA": "d/mm/yyyy",
        "sr-Latn-RS": "dd.mm.yyyy",
        "si-LK": "yyyy-mm-dd",
        "sr-Cyrl-RS": "dd.mm.yyyy",
        "lo-LA": "dd/mm/yyyy",
        "km-KH": "yyyy-mm-dd",
        "cy-GB": "dd/mm/yyyy",
        "bo-CN": "yyyy/mm/dd",
        "sms-FI": "dd.mm.yyyy",
        "as-IN": "dd-mm-yyyy",
        "ml-IN": "dd-mm-yy",
        "en-IN": "dd-mm-yyyy",
        "or-IN": "dd-mm-yy",
        "bn-IN": "dd-mm-yy",
        "tk-TM": "dd.mm.yy",
        "bs-Latn-BA": "dd.mm.yyyy",
        "mt-MT": "dd/mm/yyyy",
        "sr-Cyrl-ME": "dd.mm.yyyy",
        "se-FI": "dd.mm.yyyy",
        "zu-ZA": "yyyy/mm/ddd",
        "xh-ZA": "yyyy/mm/ddd",
        "tn-ZA": "yyyy/mm/ddd",
        "hsb-DE": "dd. M. yyyy",
        "bs-Cyrl-BA": "dd.mm.yyyy",
        "tg-Cyrl-TJ": "dd.mm.yy",
        "sr-Latn-BA": "dd.mm.yyyy",
        "smj-NO": "dd.mm.yyyy",
        "rm-CH": "dd/mm/yyyy",
        "smj-SE": "yyyy-mm-dd",
        "quz-EC": "dd/mm/yyyy",
        "quz-PE": "dd/mm/yyyy",
        "hr-BA": "dd.mm.yyyy.",
        "sr-Latn-ME": "dd.mm.yyyy",
        "sma-SE": "yyyy-mm-dd",
        "en-SG": "d/mm/yyyy",
        "ug-CN": "yyyy-mm-d",
        "sr-Cyrl-BA": "dd.mm.yyyy",
        "es-US": "mm/dd/yyyy"
    };

    return formats[navigator.language] || formats["en-US"] || 'dd/mmm/yyyy';
}