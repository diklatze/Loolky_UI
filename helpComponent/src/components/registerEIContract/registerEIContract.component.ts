import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { RegisterContractInterface } from '../interfaces/registerContract.interface';
import { RegisterContractServices } from '../../services/registerContract.services';
import { Constants } from '../../utils/constans';
import { MemberServices } from '../../services/member.services';
import { MemberInterface } from '../interfaces/member.interface';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { MessageServices } from '../../services/message.services';
import { PageService } from '../pageHeader/page.service';
import { markAllFormControlsAsTouched } from '../../utils/utils';


declare var $: any;

@Component({
    selector: 'registerContract',
    templateUrl: 'registerEIContract.component.html',
    providers: [RegisterContractServices]
})
export class RegisterEIContractPage implements OnInit {
    pageTitle: string;

    messages = null;
    eiName: string;
    eiShortName: string;
    registerContractForm: FormGroup;
    disableRegisterBtn: boolean = false;
    member: MemberInterface;

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    constructor(private formBuilder: FormBuilder, private registerContractServices: RegisterContractServices, private navController: NavController, private memberServices: MemberServices, private _MessageServices: MessageServices, private pageService: PageService) {
        this.eiName = this.pageService.getMember().fullName;
        this.eiShortName = this.pageService.getMember().shortName;
        this.member = this.pageService.getMember();
        this.pageTitle = this.eiName + " - Register Contract";

        this.memberServices.getMemberDetailsAndContractValidation(this.eiShortName, "EI").subscribe(
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
                        this.readMemberAccountAndSetErrorMessage(res);
                        ///console.log("Error message " + this.messageContent); //printed in the callback function
                        break;
                    case 586:
                        this._MessageServices.getMessage(Constants.MESSAGE_MUST_CREATE_ACCT, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, [this.eiName]);
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

    }

    private okButtonCallback = (): void => {
        this.messageModalShown = false; //close the modal and remove from DOM
        this.navController.popToRoot();
    }

    readMemberAccountAndSetErrorMessage(response: any): void {
        console.log(response.balance);

        if (response.body.contract != null) {
            this._MessageServices.getMessage(Constants.MESSAGE_CONTRACT_ALREADY_EXISTS, (resultMessage: string) => { this.messageContent = resultMessage; console.log("Error message " + this.messageContent); });
        } else if (response.balance == 0) {
            this._MessageServices.getMessage(Constants.MESSAGE_NOT_ENOUGH_ETHR, (resultMessage: string) => { this.messageContent = resultMessage; console.log("Error message " + this.messageContent); });
        } else if (response.account == null) {
            this._MessageServices.getMessage(Constants.MESSAGE_MUST_CREATE_ACCT, (resultMessage: string) => { this.messageContent = resultMessage; console.log("Error message " + this.messageContent); }, undefined, [this.eiName]);
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
        this.navController.pop();
    }

    ngOnInit() {
        this.registerContractForm = this.formBuilder.group({
            'status': new FormControl({ value: 'New', disabled: true }, Validators.required),
            'accountAddress': new FormControl({ value: '', disabled: true }, Validators.required),
            'memberFullType': new FormControl({ value: '', disabled: true }, Validators.required),
            'memberFullName': new FormControl({ value: '', disabled: true }, Validators.required),
            'memberShortName': new FormControl({ value: '', disabled: true }, Validators.required),
            'address1': new FormControl({}, Validators.maxLength(50)),
            'address2': new FormControl({}, Validators.maxLength(50)),
            'city': new FormControl({}, Validators.maxLength(35)),
            'stateOrProvince': new FormControl({}, Validators.maxLength(15)),
            'zipCode': new FormControl({}, Validators.maxLength(15)),
            'country': new FormControl({}, Validators.maxLength(35))
        })
    }

    onSubmit(val: any) {
    }

    register() {
        this.messages = null;

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
                    document.getElementById('status').scrollIntoView(false);

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