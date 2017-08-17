import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MemberInterface } from '../interfaces/member.interface';
import { MemberServices } from '../../services/member.services';
import { CustomValidators } from '../../utils/customValidators';
import { NavParams, NavController } from 'ionic-angular';
import { Constants } from '../../utils/constans';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { MessageServices } from '../../services/message.services';
import { PageService } from '../pageHeader/page.service';
import { markAllFormControlsAsTouched } from '../../utils/utils';

declare var $: any;

@Component({
    selector: 'member',
    templateUrl: 'member.component.html',
})
export class MemberPage implements OnInit {
    pageTitle: string ;

    memberId: string;

    memberTypes: string[];
    validationErrorMessage: string;

    memberForm: FormGroup;
    messages = null;

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    //In order to use it in html template
    getMemberTypeDescription: Function = Constants.getMemberTypeDescription;

    member: MemberInterface = {
        memberType: '',
        fullName: '',
        shortName: '',
        userName: ''
    }

    constructor(private formBuilder: FormBuilder, private memberServices: MemberServices, navParams: NavParams, private nav: NavController, private _MessageServices: MessageServices, private pageService: PageService) {
        this.member.userName = this.pageService.getUsername();

        this._MessageServices.getMessage(Constants.MESSAGE_ADD_ANOTHER_MEMBER, (resultMessage: string) => { this.messageContent = resultMessage });
        this._MessageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.validationErrorMessage = resultMessage });

        this.memberId = this.pageService.getMember().shortName;
        this.pageTitle = this.pageService.getMember().fullName + " - Add Member ";
    }

    ngOnInit() {
        
        this.memberServices.getMemberTypes(this.memberId).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.memberTypes = res.memberTypes;
                        break;

                    default:
                        console.error('Failed to load member types. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Failed to load member types');
                console.error(err);
            }
        )

        $('.ui.dropdown').dropdown();
        this.memberForm = this.formBuilder.group({
            'status': new FormControl({ value: 'New', disabled: true }, Validators.required),
            'memberType': new FormControl({}, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])),
            'fullName': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(35), CustomValidators.nameValidator])),
            'shortName': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(10), CustomValidators.nameValidator])),
        })

    }

    private noButtonCallback = (): void => {
        this.messageModalShown = false; //close the modal and remove from DOM
        this.nav.popToRoot();
    }

    private yesButtonCallback = (): void => {
        this.memberForm.reset();
        $('#memberType').dropdown('clear');

        this.messageModalShown = false; //close the modal and remove from DOM
    }

    onSubmit(val: any) {
        this.messages = null;
        if (this.memberForm.valid) {
            this.memberServices.addMember(this.member).subscribe(
                res => {
                    if (res.code == "0") {
                        this.actions = ModalMessage.getModalActionsYesNoPattern(this.yesButtonCallback, this.noButtonCallback);
                        this.messageModalShown = true; //show the modal
                    }
                    else {
                        this.messages = res.errors;
                        document.getElementById('status').scrollIntoView(false);
                    }
                },
                err => {
                    this.messages = [{ "fieldName": "non_field", "errorCode": "", "errorDescription": err }]
                    document.getElementById('status').scrollIntoView(false);
                });
        }
        else {
            markAllFormControlsAsTouched(this.memberForm);
        }
    }
}