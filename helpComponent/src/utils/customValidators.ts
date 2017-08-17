
import { FormControl } from '@angular/forms';
import { Constants } from './constans';

export class CustomValidators {
    /**
     * Validate passed string as valid email address.
     * @param control: FormControl will contain the email to validate
     * @return { invalidEmail: true } in case of failure, don't return value otherwise
     */
    static emailValidator(control: FormControl): { [s: string]: boolean } {
        if (!Constants.MAIL_VALIDATION_REGEX.test(control.value)) {
            return { invalidEmail: true };
        }
    }

    /**
     * Validate passed string as valid given/private person name.
     * @param control: FormControl will contain the name to validate
     * @return { invalidName: true } in case of failure, don't return value otherwise
     */
    static nameValidator(control: FormControl): { [s: string]: boolean } {
        let NOT_CONTAINS_DIGITS_REGEX = /^([^0-9]*)$/;
        if (!NOT_CONTAINS_DIGITS_REGEX.test(control.value)) {
            return { invalidName: true };
        }
    }

    /**
      * Validate passed percent number is between 0 and 100.
      * @param control: FormControl will contain the percentage to validate
      * @return { invalidPercent: true } in case of failure, don't return value otherwise
      */
    static percentValidator(control: FormControl): { [s: string]: boolean } {
        let PERCENT_REGEX = /^(100|(([1-9][0-9])|[0-9]))$/;
        if (!PERCENT_REGEX.test(control.value)) {
            return { invalidPercent: true };
        }
    }

    static passwordValidator(control: FormControl): { [s: string]: boolean } {
        let passowrdRegex = new RegExp(Constants.PASSWORD_VALIDATION_REGEX);
        if (!passowrdRegex.test(control.value)) {
            return { invalidEmail: true };
        }
    }

    static matchingPasswords(group): any {
        let password = group.controls['password'];
        let confirm = group.controls['rePassword'];

        // Don't kick in until user touches both fields   
        if (password.pristine || confirm.pristine) {
            return null;
        }

        // Mark group as touched so we can add invalid class easily
        group.markAsTouched();

        if (password.value === confirm.value) {
            return null;
        }

        return { isValid: false };
    }

    static oldPasswordDifferentFromNewPassword(group): any {
        let password = group.controls['password'];
        let oldPassword = group.controls['oldPassword'];

        // Don't kick in until user touches both fields   
        if (password.pristine || oldPassword.pristine) {
            return null;
        }

        // Mark group as touched so we can add invalid class easily
        group.markAsTouched();

        if (password.value != oldPassword.value) {
            return null;
        }

        return { isValid: false };
    }

    /**
      * Validate passed value to contain only digits or letters (upper or lower)
      * @param control: FormControl will contain the value to validate
      * @return { invalidAlphanumericValue: true } in case of failure, don't return value otherwise
      */
    static alphaNumericValidator(control: FormControl): { [s: string]: boolean } {
        const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

        if (!ALPHA_NUMERIC_REGEX.test(control.value)) {
            return { invalidAlphanumericValue: true };
        }
    }

    /**
      * Validate passed value to be a valid positive integer or empty string. Bigger than 0 and don't start with 0.
      * @param control: FormControl will contain the value to validate
      * @return { invalidPositiveIntegerValue: true } in case of failure, don't return value otherwise
      */
    static emptyOrPositiveIntegerValidator(control: FormControl): { [s: string]: boolean } {
        if (control.value != undefined && control.value != '') {
            const POSITIVE_INTEGER_REGEX = /^[1-9]\d{0,9}$/;

            if (!POSITIVE_INTEGER_REGEX.test(control.value)) {
                return { invalidPositiveIntegerValue: true };
            }
        }
    }


    /**
      * Validate passed value to be a not empty string
      * @param control: FormControl will contain the value to validate
      * @return { emptyString: true } in case of failure, don't return value otherwise
      */
    static notEmptyString(control: FormControl): { [s: string]: boolean } {
        if (control.value == undefined || control.value == null || (typeof control.value == 'string' && control.value.trim() == '')) {
            return { emptyString: true };
        }
    }


    /**
      * Validate passed value to be a not empty Object
      * @param control: FormControl will contain the value to validate
      * @return { emptyObject: true } in case of failure, don't return value otherwise
      */
    static notEmptyObject(control: FormControl): { [s: string]: boolean } {
        if (JSON.stringify(control.value) == "{}") {
            return { emptyObject: true };
        }
    }

    static validTime(control: FormControl): any {
        if (control.pristine || !control.value) {
            return null;
        }

        let hh: number = control.value.hh == null || control.value.hh == '' ? NaN : +control.value.hh;
        let mm: number = control.value.mm == null || control.value.mm == '' ? NaN : +control.value.mm;

        if (isNaN(hh) && isNaN(mm)) {
            return null;
        }

        if (isNaN(hh) || isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
            return { isValid: false };
        }
    }
}