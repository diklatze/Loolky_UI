import { Component, OnInit } from '@angular/core';
import { SecurityServices } from '../../services/security.services';
import { Constants } from '../../utils/constans';
import { NavController } from 'ionic-angular';
import { Login } from '../login/login.component';
import { UserType } from '../../utils/constans';
import { PageService } from '../pageHeader/page.service';

declare var $: any;

@Component({
    selector: 'signup',
    templateUrl: 'signup.component.html',
    providers: [SecurityServices]
})
export class Signup implements OnInit {
    constructor(private securityServices: SecurityServices, private nav: NavController, private pageService: PageService) {
    }

    pageTitle: string = "Sign up User";

    usernameInput: string;
    usertypeInput: string = String(UserType.Student);
    errorString: string;
    successString: string;

    ngOnInit() {
    }

    /**
     * Make a signup call to security service after the signup data is validated.
     * @method signup
     */
    signup() {
        //console.log("SIGNUP.COMPONENT:: username=[",this.usernameInput,"],usertype=[",this.usertypeInput,"]");
        if (!this.validate()) {
            this.errorString = Constants.SIGNUP_ERROR_MESAGE;
            this.successString = null;
        } else {
            this.errorString = null;
            this.successString = null;
            this.securityServices.signup(this.usernameInput, this.usertypeInput).subscribe(
                res => {
                    console.log(`SignUp reposnse received ${JSON.stringify(res)}`);
                    if (res.code == "0") {
                        console.log(`Successfully signup`);
                    }
                    // Even if student email failed during validation on server side,
                    // success string will be displayed (kgb mode)
                    this.successString = Constants.SIGNUP_SUCCESS_MESAGE;
                }
            );
        }
        return false;
    }

    redirectToLogin() {
        this.nav.pop();
    }

    /**
     * Validate signup page entered data. 
     * Username is valid email address.
     * @method validate
     *
     * @return {boolean} true if all data are valid, false otherwise.
     */
    validate(): boolean {
        return (this.validateEmail(this.usernameInput));
    }

    /**
     * Validate passed string as valid email address.
     * @method validateEmail
     * @param {string} Email to validate.
     * @return {boolean} true if passed email is valid, false otherwise.
     */
    validateEmail(email: string): boolean {
        return Constants.MAIL_VALIDATION_REGEX.test(email);
    }

    getErrorString() {
        return this.errorString;
    }

    getSuccessString() {
        return this.successString;
    }
}