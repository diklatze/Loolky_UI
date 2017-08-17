import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MemberInterface } from '../interfaces/member.interface';
import { MemberServices } from '../../services/member.services';
import { CustomValidators } from '../../utils/customValidators';
import { NavController } from 'ionic-angular';
import { Constants } from '../../utils/constans';
import { MessageServices } from '../../services/message.services';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { PageService } from '../pageHeader/page.service';
import { markAllFormControlsAsTouched } from '../../utils/utils';

declare var $: any;

@Component({
    selector: 'memberAccountCreat',
    templateUrl: 'memberAccountCreat.component.html',
})
export class MemberAccountCreatePage implements OnInit {
    pageTitle: string;

    member: MemberInterface;
    form: FormGroup;
    validationErrorMessage: string;
    passwordDontMatchMessage: string;

    password: string;
    rePassword: string;
    messages = null;

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    constructor(private formBuilder: FormBuilder, private memberServices: MemberServices, 
        private navController: NavController, private _MessageServices: MessageServices, private pageService: PageService) {
        this._MessageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.validationErrorMessage = resultMessage });
        this._MessageServices.getMessage(Constants.MESSAGE_PASSWORD_DONT_MATCH, (resultMessage: string) => { this.passwordDontMatchMessage = resultMessage });

        this.member = this.pageService.getMember();
        this.pageTitle = this.member.fullName + " - Create Account";
    }

    private okButtonCallback = (): void => {
        this.messageModalShown = false; //close the modal and remove from DOM
        this.navController.popToRoot();
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'password': new FormControl({}, Validators.compose([Validators.required, CustomValidators.passwordValidator])),
            'rePassword': new FormControl({}, Validators.compose([Validators.required, CustomValidators.passwordValidator])),
        }, { validator: CustomValidators.matchingPasswords });
    }

    onSubmit(val: any) {
        this.messages = null;
        if (this.form.valid) {
            let req = { password: this.password, rePassword: this.rePassword};
            this.memberServices.createMemberAccount(this.member.shortName, req).subscribe(
                res => {
                    if (res.code == "0") {
                        this.pageService.setMember(res.body);
                        this._MessageServices.getMessage(Constants.MESSAGE_ACCT_CREATED_SUCCESSFULLY, (resultMessage: string) => { this.messageContent = resultMessage });
                        this.actions = ModalMessage.getModalActionsOKPattern(this.okButtonCallback); //get actions for modal message screen
                        this.messageModalShown = true; //show the modal
                    }
                    else {
                        this.messages = res.errors;
                        document.getElementById('passwordTxt').scrollIntoView(false);
                    }
                },
                err => {
                    this.messages = [{ "fieldName": "non_field", "errorCode": "", "errorDescription": err }];
                    document.getElementById('passwordTxt').scrollIntoView(false);
                });
        }
        else {
            markAllFormControlsAsTouched(this.form);
        }
    }
}