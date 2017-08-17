import { Component, OnInit } from '@angular/core';
import { PasswordServices } from '../../services/password.services';
import { Constants } from '../../utils/constans';
import { NavController } from 'ionic-angular';
import { Login } from '../login/login.component';
import { UserType } from '../../utils/constans';
import { PageService } from '../pageHeader/page.service';
import { MessageServices } from '../../services/message.services';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';


declare var $: any;

@Component({
    selector: 'forgotPassword',
    templateUrl: 'forgotPassword.component.html',
    providers: [PasswordServices]

})
export class ForgotPassword implements OnInit {
    constructor(private passwordServices: PasswordServices, private nav: NavController, private pageService: PageService, private messageServices: MessageServices) {
    }

    pageTitle: string = "Forgot Password";
    usernameInput: string;
    usertypeInput: string = String(UserType);
    errorString: string;
    successString: string;
    messageContent: string;
    messageHeader: string;
    messages: any[] = null;
    actions: ActionsInterface = null;
    messageModalShown: boolean = false;

    ngOnInit() {
    }

    ForgotPassword() {
        if (!this.validate()) {
            this.errorString = Constants.SIGNUP_ERROR_MESAGE;
        }
        else {
            this.errorString = null;
            this.messages = null;

            this.passwordServices.forgotPassword(this.usernameInput).subscribe(
                res => {
                    this.showModal(Constants.MESSAGE_EMAIL_FORGOT_PASSWORD_SENT_MESSAGE, Constants.MESSAGE_EMAIL_FORGOT_PASSWORD_SENT_HEADER, this.close);
                });
        }
    }

    redirectToLogin() {
        this.nav.pop();
    }

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

    showModal(messageId: string, headerId: string, callbackFunction: Function): void {
        this.messageServices.getMessage(messageId, (resultMessage: string) => { this.messageContent = resultMessage });
        this.messageServices.getMessage(headerId, (resultMessage: string) => { this.messageHeader = resultMessage });
        this.actions = ModalMessage.getModalActionsPattern(callbackFunction); //get actions for modal message screen
        this.messageModalShown = true; //show the modal
    }

    close = (): void => {
        this.nav.setRoot(Login);
    }
}