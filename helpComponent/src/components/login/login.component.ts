import { Component, OnInit, Input } from '@angular/core';
import { SecurityServices } from '../../services/security.services';
import { Constants } from '../../utils/constans';
import { EiLandingPage } from '../landingPage/eiLandingPage.component';
import { StudentLandingPage } from '../landingPage/studentLandingPage.component';
import { GovermentLandingPage } from '../landingPage/govermentLandingPage.component';
import { MarketplaceLandingPage } from '../landingPage/marketplaceLandingPage.component';
import { OrganizationLandingPage } from '../landingPage/organizationLandingPage.component';
import { Signup } from '../signup/signup.component';
import { ForgotPassword } from '../forgotPassword/forgotPassword.component';
import { NavController } from 'ionic-angular';
import { UserType } from '../../utils/constans';
import { PageResolver } from '../../utils/page.resolver';
import { PageService } from '../pageHeader/page.service';
import { StudentInterface } from '../interfaces/student.interface';
import { ChangePasswordPage } from '../changepassword/changePassword.component';

declare var $: any;

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    providers: [SecurityServices, PageResolver]
})
export class Login implements OnInit {
    constructor(private securityServices: SecurityServices, protected navController: NavController, private pageResolver: PageResolver, protected pageService: PageService) {
    }

    usernameInput: string;
    passwordInput: string;
    errorString: string;
    forceChangePassword: boolean = false;

    ngOnInit() { }

    /**
     * Make a login call to security service after the login data is validated.
     * @method login
     */
    login() {
        this.forceChangePassword = false;
        if (!this.validate()) {
            this.errorString = Constants.LOGIN_ERROR_MESAGE;
        }
        else {
            this.errorString = null;
            this.securityServices.login(this.usernameInput, this.passwordInput).subscribe(
                res => {
                    if (res.code == "0") {
                        console.log(`User type is ${res.userType}`);

                        //check if user should be forced to change password 
                        this.forceChangePassword = res.body.tempPassword;

                        switch (res.userType) {

                            case UserType.EIUser:
                                this.pageService.setUsertype(String(UserType.EIUser));
                                this.pageService.setMember(res.body.member);
                                this.pageService.setUsername(this.usernameInput);
                                this.pageService.setLandingPage(EiLandingPage);
                                this.setRoot(EiLandingPage);
                                break;

                            case UserType.Student:
                                res.body.emailAddress = res.body.email; //TODO: the returned object doesn't comply student interface - fix the backend
                                this.pageService.setStudent(res.body);
                                this.pageService.setUsername(res.body.email);
                                this.pageService.setUsertype(String(UserType.Student));
                                this.studentLogin(); //different implementation for mobile and web
                                break;

                            case UserType.Government:
                                this.pageService.setMember(res.body.member);
                                this.pageService.setUsername(res.body.email);
                                this.pageService.setUsertype(String(UserType.Government));
                                this.pageService.setLandingPage(GovermentLandingPage);
                                this.setRoot(GovermentLandingPage);
                                break;

                            case UserType.Marketplace:
                                this.pageService.setUsertype(String(UserType.Marketplace));
                                this.pageService.setUsername(res.body.email);
                                this.pageService.setMember(res.body.member);
                                this.pageService.setLandingPage(MarketplaceLandingPage);
                                this.setRoot(MarketplaceLandingPage);
                                break;

                            case UserType.Organization:
                                this.pageService.setUsertype(String(UserType.Organization));
                                this.pageService.setUsername(res.body.email);
                                this.pageService.setMember(res.body.member);
                                this.pageService.setLandingPage(OrganizationLandingPage);
                                this.setRoot(OrganizationLandingPage);
                                break;

                            default:
                                console.error(`Unknown user type ${res.userType}`);
                        }
                    }
                    else {
                        this.errorString = Constants.LOGIN_ERROR_MESAGE;
                    }
                }
            );
        }
        return false;
    }

    studentLogin() {
        this.pageService.setLandingPage(StudentLandingPage);
        this.setRoot(StudentLandingPage);
    }

    setRoot(page: any) {
        this.navController.setRoot(this.forceChangePassword ? ChangePasswordPage : page);
    }

    /**
     * Validate login page entered data. 
     * Username and password fields are mandatory,
     * Username is valid email address.
     * @method validate
     *
     * @return {boolean} true if all data are valid, false otherwise.
     */
    validate(): boolean {
        return (this.usernameInput && this.passwordInput && this.validateEmail(this.usernameInput));
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

    redirectToSignup(): void {
        this.navController.push(Signup);
    }

    redirectToForgotPassword(): void {
        this.navController.push(ForgotPassword);
    }

    redirectTo(path: string): void {
        this.navController.push(path);
    }

    getErrorString() {
        return this.errorString;
    }
}