import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ChangePasswordInterface } from '../interfaces/changePassword.interface';
import { PasswordServices } from '../../services/password.services';
import { PageService } from '../pageHeader/page.service';
import { markAllFormControlsAsTouched } from '../../utils/utils';
import { CustomValidators } from '../../utils/customValidators';
import { MessageServices } from '../../services/message.services';
import { Constants, UserType } from '../../utils/constans';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { NavController, NavParams } from 'ionic-angular';
import { PageResolver } from '../../utils/page.resolver';

declare var $: any;

@Component({
    selector: 'changePassword',
    templateUrl: 'changePassword.component.html',
    providers: [PasswordServices]
})
export class ChangePasswordPage implements OnInit {
    changePasswordForm: FormGroup;
    pageHeaderBlockNavigation: boolean = true;

    messages: any[] = null;

    passwordRulesMessageArr: string[] =
    [
        `Minimum number of characters required: 8.`,
        `The following character types must be represented: alphabetic characters, uppercase characters, lowercase characters, numbers 0 - 9, special characters!”#$%&()*+,.=?@[\]^{}~`
    ];

    validationErrorMessage: string;
    passwordDontMatchMessage: string;
    passwordNewDifferentFromOld: string;

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    isMobile: boolean;

    pageTitle: string;
    changePassword: ChangePasswordInterface = <ChangePasswordInterface>{};

    constructor(private formBuilder: FormBuilder, private changePasswordServices: PasswordServices, private pageService: PageService,
        private messageServices: MessageServices, private navController: NavController, navParams: NavParams, pageResolver: PageResolver) {

        this.pageHeaderBlockNavigation = !(navParams.get('enablePageHeaderNavigation') === true);

        this.messageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.validationErrorMessage = resultMessage });
        this.messageServices.getMessage(Constants.MESSAGE_PASSWORD_DONT_MATCH, (resultMessage: string) => { this.passwordDontMatchMessage = resultMessage });
        this.messageServices.getMessage(Constants.MESSAGE_PASSWORD_NEW_DIFFER_FROM_OLD, (resultMessage: string) => { this.passwordNewDifferentFromOld = resultMessage });

        this.setPageTitle();
        this.isMobile = pageResolver.isMobile();
    }

    setPageTitle() {
        let userName = this.pageService.getUsertype() == UserType.Student.toString() ? this.pageService.getStudent().givenName : this.pageService.getMember().fullName;
        this.pageTitle = userName + " - Change Password";
    }

    ngOnInit() {
        this.changePasswordForm = this.formBuilder.group({
            oldPassword: new FormControl({}, Validators.required),
            password: new FormControl({}, Validators.compose([Validators.required, CustomValidators.passwordValidator])),
            rePassword: new FormControl({}, Validators.compose([Validators.required, CustomValidators.passwordValidator])),
        }, { validator: Validators.compose([CustomValidators.matchingPasswords, CustomValidators.oldPasswordDifferentFromNewPassword]) })
    }

    onSubmit() {
        this.messages = null;

        let memberId = this.pageService.getUsertype() == UserType.Student.toString() ? this.pageService.getStudent().email : this.pageService.getUsername();

        if (this.changePasswordForm.valid) {
            this.changePasswordServices.changePassword(memberId, this.changePassword).subscribe(
                res => {
                    if (res.code == "0") {
                        this.showModal(Constants.MESSAGE_PASSWORD_CHANGED_SUCCESSFULLY, this.close);
                    }
                    else {
                        this.messages = res.errors;
                    }
                },
                err => {
                    this.messages = [{ "fieldName": "non_field", "errorCode": "", "errorDescription": err }];
                });

        }
        else {
            markAllFormControlsAsTouched(this.changePasswordForm);
        }
    }

    showModal(messageId: string, callbackFunction: Function): void {
        this.messageServices.getMessage(messageId, (resultMessage: string) => { this.messageContent = resultMessage });
        this.actions = ModalMessage.getModalActionsPattern(callbackFunction); //get actions for modal message screen
        this.messageModalShown = true; //show the modal
    }

    close = (): void => {
        this.navController.setRoot(this.pageService.getLandingPage());
    }
}