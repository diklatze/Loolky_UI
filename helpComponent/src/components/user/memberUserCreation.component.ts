import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserOfMemberInterface } from '../interfaces/userOfMember.interface';
import { MarketplaceServices } from '../../services/marketplace.services';
import { MessageServices } from '../../services/message.services';
import { CustomValidators } from '../../utils/customValidators';
import { MemberServices } from '../../services/member.services';
import { NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../utils/constans';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { PageService } from '../pageHeader/page.service';
import { markAllFormControlsAsTouched } from '../../utils/utils';

declare var $: any;

@Component({
    selector: 'memberUserCreation',
    templateUrl: 'memberUserCreation.component.html',
    providers: [MarketplaceServices]
})

export class MemberUserCreation implements OnInit, AfterViewInit {
    @ViewChild('memberTypeCombo') memberTypeComboElementRef: ElementRef;
    @ViewChild('memberNameCombo') memberNameComboElementRef: ElementRef;

    userForm: FormGroup;

    pageTitle: string;
    memberId: string;

    memberTypes: string[];
    memberNames: any = null;
    validationErrorMessage: string;
    user: UserOfMemberInterface;
    messages = null;

    //In order to use it in html template
    getMemberTypeDescription: Function = Constants.getMemberTypeDescription;

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    applicationUserCreation: boolean = false;

    constructor(private _formBuilder: FormBuilder, private marketplaceServices: MarketplaceServices, private _MemberServices: MemberServices,
        private nav: NavController, navParams: NavParams, private _MessageServices: MessageServices, private pageService: PageService, private memberServices: MemberServices) {

        this.user = {
            registeredByDHAdmin: this.pageService.getUsername(),
            status: 'New',
            memberType: '',//EI or GOV or Organization
            memberName: '', //i.e. University of Toronto
            familyName: '',
            givenName: '',
            email: '',
            role: ''
        }

        this._MessageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.validationErrorMessage = resultMessage });
        this._MessageServices.getMessage(Constants.MESSAGE_ADD_ANOTHER_USER, (resultMessage: string) => { this.messageContent = resultMessage });

        this.memberId = this.pageService.getMember().shortName;
        

        this.applicationUserCreation = (navParams.get('applicationUserCreation') === true);

        if( this.applicationUserCreation){
            this.pageTitle = this.pageService.getMember().fullName + " - Add Application User ";
        }
        else{
            this.pageTitle = this.pageService.getMember().fullName + " - Add Member User ";
        }
    }

    private noButtonCallback = (): void => {
        this.messageModalShown = false; //close the modal and remove from DOM
        this.nav.popToRoot();
    }

    private yesButtonCallback = (): void => {
        this.userForm.reset();
        $(this.memberNameComboElementRef.nativeElement).dropdown('clear');
        $(this.memberTypeComboElementRef.nativeElement).dropdown('clear');

        if (this.applicationUserCreation) {
            this.setDropdownValue();
        }

        this.messageModalShown = false; //close the modal and remove from DOM
    }

    ngOnInit() {

        if (this.applicationUserCreation) {
            this.memberNames = [this.pageService.getMember()];
            this.memberTypes = [this.pageService.getMember().memberType];
        }
        else {
            this._MemberServices.getMemberTypes(this.memberId).subscribe(
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
        }

        this.userForm = this._formBuilder.group({
            'status': new FormControl({ value: 'New', disabled: true }, Validators.required),
            'memberType': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(12)])),
            'memberName': new FormControl({}, Validators.compose([Validators.required])),
            'familyName': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(30), CustomValidators.nameValidator])),
            'givenName': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(30), CustomValidators.nameValidator])),
            'email': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(100), CustomValidators.emailValidator])),
            'role': new FormControl({}, Validators.compose([Validators.maxLength(10), CustomValidators.nameValidator])),
        });
    }

    ngAfterViewInit() {
        //initialize the search dropdown list
        $(this.memberTypeComboElementRef.nativeElement).dropdown();
        $(this.memberNameComboElementRef.nativeElement).dropdown();

        if (this.applicationUserCreation) {
            this.setDropdownValue();
        }

    }

    onMemberTypeChange(memberType: string) {
        if (memberType == ''|| this.applicationUserCreation) {
            return;
        }
        //clear the memberNameCombo value
        this.user.memberName = '';
        $(this.memberNameComboElementRef.nativeElement).dropdown('clear');

        this.memberNames = null;
        this._MemberServices.getAllMembers(memberType, this.memberId).subscribe(
            res => {
                if (res.code == "0") {
                    this.memberNames = res.body;
                }
                else {
                    console.error("Error while getting member names");
                }
            },
            err => {
                console.error("Error while getting member names with error: " + err);
            }
        )
    }

    onSubmit(val: any) {
        this.messages = null;
        if (this.userForm.valid) {
            this.marketplaceServices.addUserOfMember(this.user).subscribe(
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
                });
        }
        else {
            markAllFormControlsAsTouched(this.userForm);
        }
    }

    setDropdownValue(){
            $(this.memberTypeComboElementRef.nativeElement).dropdown('set value', this.pageService.getMember().memberType).addClass("disabled");
            $(this.memberNameComboElementRef.nativeElement).dropdown('set value', this.pageService.getMember().shortName).addClass("disabled");
    }

}