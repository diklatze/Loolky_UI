import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { RegisterContractInterface } from '../interfaces/registerContract.interface';
import { RegisterContractServices } from '../../services/registerContract.services';
import { Constants } from '../../utils/constans';
import { MemberServices } from '../../services/member.services';
import { MemberInterface } from '../interfaces/member.interface';
import { MessageServices } from '../../services/message.services';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { PageService } from '../pageHeader/page.service';
import { UtilsServices } from '../../services/utils.services';
import { markAllFormControlsAsTouched } from '../../utils/utils';

declare var $: any;

@Component({
    selector: 'registerContract',
    templateUrl: 'registerGovContract.component.html',
    providers: [RegisterContractServices, UtilsServices]
})
export class RegisterGovContractPage implements OnInit {
    messages = null;

    pageTitle: string;

    govName: string;
    govShortName: string;
    registerContractForm: FormGroup;
    disableRegisterBtn: boolean = false;
    member: MemberInterface;

    ccyArr: { value: string, desc: string }[];

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    validationErrorMessage: string;

    constructor(private formBuilder: FormBuilder, private registerContractServices: RegisterContractServices,
        private nav: NavController, private memberServices: MemberServices, private _MessageServices: MessageServices, private pageService: PageService, utilsServices: UtilsServices) {
        this.govName = this.pageService.getMember().fullName;
        this.govShortName = this.pageService.getMember().shortName;
        this.member = this.pageService.getMember();
        this.pageTitle = this.govName + " - Register Contract";

        utilsServices.getListOfCurrencies().subscribe(
            res => { this.ccyArr = res },
            err => {
                console.error('Register Gov Contract: Error occured on getListOfCurrencies');
                console.error(err);
            });

        this.memberServices.getMemberDetailsAndContractValidation(this.govShortName, "Government").subscribe(
            res => {
                console.log(res);
                console.log(res.body);

                this.actions = ModalMessage.getModalActionsOKPattern(this.okButtonCallback); //get actions for modal message screen

                switch (res.code) {
                    case 0:
                        this.registerContract.accountAddress = res.account;
                        this.registerContract.memberFullType = Constants.getMemberTypeDescription(res.body.memberType);
                        this.registerContract.memberFullName = res.body.fullName;
                        this.registerContract.memberShortName = res.body.shortName;
                        this.registerContract.memberType = res.body.memberType;
                        let message = this.readMemberAccountAndSetErrorMessage(res);
                        console.log(Constants.MEMBER_TYPES[0]);
                        break;
                    case 586:
                        this._MessageServices.getMessage(Constants.MESSAGE_MUST_CREATE_ACCT, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, [this.govName]);
                        this.disableRegisterBtn = true;
                        this.messageModalShown = true; //show the modal  
                        break;
                    case 588:
                        this._MessageServices.getMessage(Constants.MESSAGE_CONTRACT_ALREADY_EXISTS, (resultMessage: string) => { this.messageContent = resultMessage });
                        this.disableRegisterBtn = true;
                        this.messageModalShown = true; //show the modal
                        break;
                    case 589:
                        this._MessageServices.getMessage(Constants.MESSAGE_NOT_ENOUGH_ETHR, (resultMessage: string) => { this.messageContent = resultMessage });
                        this.disableRegisterBtn = true;
                        this.messageModalShown = true; //show the modal
                }
            },
            err => {
                console.error(err);
            });

            this._MessageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.validationErrorMessage = resultMessage });
    }

    private okButtonCallback = (): void => {
        this.messageModalShown = false; //close the modal and remove from DOM
        this.nav.popToRoot();
    }

    readMemberAccountAndSetErrorMessage(response: any): void {
        console.log(response.balance);

        if (response.body.contract != null) {
            this._MessageServices.getMessage(Constants.MESSAGE_CONTRACT_ALREADY_EXISTS, (resultMessage: string) => { this.messageContent = resultMessage; console.log("Error message " + this.messageContent); });
        } else if (response.balance == 0) {
            this._MessageServices.getMessage(Constants.MESSAGE_NOT_ENOUGH_ETHR, (resultMessage: string) => { this.messageContent = resultMessage; console.log("Error message " + this.messageContent); });
        } else if (response.account == null) {
            this._MessageServices.getMessage(Constants.MESSAGE_MUST_CREATE_ACCT, (resultMessage: string) => { this.messageContent = resultMessage; console.log("Error message " + this.messageContent); }, undefined, [this.govName]);
        }
    }

    registerContract: RegisterContractInterface = {
        status: 'New',
        accountAddress: '',
        memberType: '',
        memberFullType: '',
        memberFullName: '',
        memberShortName: '',
        address1: '',
        address2: '',
        city: '',
        stateOrProvince: '',
        zipCode: '',
        country: '',
        currency: ''
    }

    goBack() {
        this.nav.pop();
    }

    ngOnInit() {
        this.registerContractForm = this.formBuilder.group({
            'status': new FormControl({ value: 'New', disabled: true }, Validators.required),
            'accountAddress': new FormControl({ value: '', disabled: true }, Validators.required),
            'memberFullType': new FormControl({ value: '', disabled: true }, Validators.required),
            'memberFullName': new FormControl({ value: '', disabled: true }, Validators.required),
            'memberShortName': new FormControl({ value: '', disabled: true }, Validators.required),
            'address1': new FormControl({}),
            'address2': new FormControl({}),
            'city': new FormControl({}),
            'stateOrProvince': new FormControl({}),
            'zipCode': new FormControl({}),
            'country': new FormControl({}),
            'currency': new FormControl({ value: '', disabled: false }, Validators.required)
        })
    }

    ngAfterViewInit() {
        $('#currency').dropdown(); //do not select the value on click
    }

    onSubmit(val: any) {
    }

    register() {
        this.messages = null;
        //console.log("this.registerContractForm.valid = " + this.registerContractForm.valid);

        if (this.registerContractForm.valid) {
            this.registerContractServices.registerContract(this.registerContract).subscribe(
                res => {
                    if (res.code == "0") {
                        this._MessageServices.getMessage(Constants.MESSAGE_SUCCESSFUL_REGISTRATION, (resultMessage: string) => { this.messageContent = resultMessage });
                        this.disableRegisterBtn = true;
                        this.messageModalShown = true; //show the modal
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
            markAllFormControlsAsTouched(this.registerContractForm);
        }
    }

}