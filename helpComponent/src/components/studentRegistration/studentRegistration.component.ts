import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { StudentInterface } from '../interfaces/student.interface';
import { StudentServices } from '../../services/student.services';
import { CustomValidators } from '../../utils/customValidators';
import { NavParams, NavController } from 'ionic-angular';
import { Constants } from '../../utils/constans';
import { MemberInterface } from '../interfaces/member.interface';
import { MessageServices } from '../../services/message.services';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { MemberServices } from '../../services/member.services';
import { InputItemInterface } from '../interfaces/listManage.interface';
import { PageService } from '../pageHeader/page.service';
import { filterDigitsOnly, toDate } from '../../utils/utils';
import { markAllFormControlsAsTouched } from '../../utils/utils';
import { PageResolver } from '../../utils/page.resolver';

declare var $: any;

@Component({
    selector: 'studentRegistration',
    templateUrl: 'studentRegistration.component.html',
    providers: [StudentServices]
})

export class StudentRegistrationPage implements OnInit, AfterViewInit {
    pageTitle: string;

    @ViewChild('statusDropdown') statusDropdownElementRef: ElementRef;
    @ViewChild('facultyDropdown') facultyDropdownElementRef: ElementRef;
    eiName: string;
    member: MemberInterface;
    registrionDate: string;
    date: Date;

    messages = null;
    studentForm: FormGroup;
    validationErrorMessage: string;
    faculties: [InputItemInterface];
    statuses = ["Active", "Inactive"];
    hideHeader: boolean = false;

    filterDigitsOnly: Function = filterDigitsOnly; //required in order to use it in html template

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;
    readOnlyMode: boolean;
    updateMode: boolean;

    student: StudentInterface = {
        universityName: null,
        familyName: null,
        givenName: null,
        status: 'Active',
        registrationDate: null,
        idType: null,
        idNumber: null,
        faculty: null,
        address1: null,
        address2: null,
        levelOfStudy: null,
        semester: null,
        year: null,
        percentOfStudies: null,
        city: null,
        stateOrProvince: null,
        postalCode: null,
        phoneNumber: null,
        email: null,
        password: null
    }

    constructor(private memberServices: MemberServices, private _formBuilder: FormBuilder, private _studentServices: StudentServices, navParams: NavParams, private _MessageServices: MessageServices, private nav: NavController, private pageService: PageService, private pageResolver: PageResolver) {

        this.readOnlyMode = (navParams.get('readOnlyMode') === true);
        this.updateMode = (navParams.get('updateMode') === true);
        this.hideHeader = (navParams.get('hideHeader') === true);

        this.student = navParams.get('student') ? navParams.get('student') : this.student;

        if (this.readOnlyMode) {
            this.student = this.pageService.getStudent();
            this.pageTitle = pageResolver.isMobile() ? "My Profile" : this.student.givenName + " - My Profile";
        }
        else {
            this.member = this.pageService.getMember();
            this.eiName = this.member.fullName;
            this.student.eiId = this.getEiId();
            this.pageTitle = this.eiName + " - Student Registration";
        }

        this._MessageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.validationErrorMessage = resultMessage });
    }

    ionViewDidLeave(){
        this.nav.popToRoot();
    }
    
    getEiId(): string {
        return (this.member ? this.member.shortName : null);
    }

    private noButtonCallback = (): void => {
        this.messageModalShown = false; //close the modal and remove from DOM
        this.nav.popToRoot();
    }

    private yesButtonCallback = (): void => {
         
        
        this.studentForm.reset({ 'registrationDate': new DatePipe(Constants.LOCALE).transform(new Date(), 'shortDate')})
        $(this.facultyDropdownElementRef.nativeElement).dropdown('clear');
        $(this.statusDropdownElementRef.nativeElement).dropdown('set selected', 'Active');
        this.student.eiId = this.getEiId();
        this.messageModalShown = false; //close the modal and remove from DOM
    }

    getActions(backButtonOnly?: boolean): ActionsInterface {
        let returnData: any;

        if (backButtonOnly) {
            returnData = ModalMessage.getModalActionsOKPattern(this.noButtonCallback);
        }
        else {
            returnData = ModalMessage.getModalActionsYesNoPattern(this.yesButtonCallback, this.noButtonCallback);
        }

        return returnData;
    }

    ngOnInit() {
        this.studentForm = this._formBuilder.group({
            'status': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(30)])),
            'registrationDate': new FormControl({ value: new DatePipe(Constants.LOCALE).transform(new Date(), 'shortDate'), disabled: true }, Validators.required),
            'familyName': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(30)])),
            'idType': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(30)])),
            'idNumber': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(15)])),
            'givenName': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(30)])),
            'email': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(100), CustomValidators.emailValidator])),
            'address1': new FormControl({}, Validators.maxLength(50)),
            'faculty': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(50)])),
            'address2': new FormControl({}, Validators.maxLength(50)),
            'city': new FormControl({}, Validators.maxLength(35)),
            'levelOfStudy': new FormControl({}, Validators.maxLength(20)),
            'semester': new FormControl({}, Validators.maxLength(10)),
            'year': new FormControl({}, Validators.compose([Validators.maxLength(4), Validators.pattern('^(1|2)\\d{3}$')])),
            'stateOrProvince': new FormControl({}, Validators.maxLength(15)),
            'percentOfStudies': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(3), CustomValidators.percentValidator])),
            'postalCode': new FormControl({}, Validators.maxLength(15)),
        });

        if (this.readOnlyMode) {
            this.date = this.student.registrationDate;

            this.registrionDate = new DatePipe(Constants.LOCALE).transform(this.date, 'shortDate')
            this.studentForm.controls['registrationDate'].setValue(this.registrionDate);
            this.studentForm.disable();
        }

        if (this.updateMode) {
            this.studentForm.get("email").disable();
        }

        if (!this.readOnlyMode) {
            this.memberServices.getFaculties(this.member.shortName).subscribe(
                res => {
                    switch (res.code) {
                        case 0:
                            this.faculties = res.current_data;

                            if (this.updateMode) {
                                this.setDropdownValues();
                                // Disable form when student status is inactive
                                if (this.student && this.student.status == this.statuses[1]) {
                                    this.studentForm.disable();
                                    this.setDropdownDisabled();
                                }
                            }

                            //Show modal in case when faculties were not published yet
                            if (!this.faculties || this.faculties.length == 0) {
                                this._MessageServices.getMessage(Constants.MESSAGE_MEMBER_DID_NOT_PUBLISH_FACULTIES, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, [this.eiName]);
                                this.actions = this.getActions(true);
                                this.messageModalShown = true; //show the modal
                            }
                            break;

                        case 590:
                            //You must be registered before you can do that!
                            this._MessageServices.getMessage(Constants.MESSAGE_MUST_BE_REGISTERED, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, [this.eiName]);
                            this.actions = this.getActions(true);
                            this.messageModalShown = true; //show the modal                        
                            break;

                        case 586:
                            //You must create an account before you can do that!
                            this._MessageServices.getMessage(Constants.MESSAGE_MUST_CREATE_ACCT, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, [this.eiName]);
                            this.actions = this.getActions(true);
                            this.messageModalShown = true;
                            break;

                        default:
                            console.error('Failed to load faculties list. Error code: ' + res.code);
                    }
                },
                err => {
                    console.error('Failed to load faculties list');
                    console.error(err);
                });
        }
    }

    ngAfterViewInit() {
        this.initDropdown(this.statusDropdownElementRef);
        this.initDropdown(this.facultyDropdownElementRef);
    }

    initDropdown(element: any) {
        if (element) {
            $(element.nativeElement).dropdown();
        }
    }

    setDropdownValues() {
        setTimeout(() => {
            $(this.statusDropdownElementRef.nativeElement).dropdown('set selected', this.student.status);
            $(this.facultyDropdownElementRef.nativeElement).dropdown('set selected', this.student.faculty.name);
            this.studentForm.markAsPristine();
        });
    }

    setDropdownDisabled() {
        $(this.statusDropdownElementRef.nativeElement).dropdown().addClass("disabled");
        $(this.facultyDropdownElementRef.nativeElement).dropdown().addClass("disabled");
    }
    onSubmit(val: any) {
        this.messages = null;
        if (this.studentForm.valid) {
            this.student.universityName = this.member.shortName;
            //        const index = $("#faculty option:selected").index() - 1;
            //        this.studentForm.patchValue({ faculty: index });

            this._studentServices.register(this.student).subscribe(
                res => {
                    if (res.code == "0") {
                        this._MessageServices.getMessage(Constants.MESSAGE_REGISTER_ANOTHER_STUDENT, (resultMessage: string) => { this.messageContent = resultMessage });
                        this.actions = this.getActions();
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
            markAllFormControlsAsTouched(this.studentForm);
        }
    }

    public isDirty = (): boolean => {
        if (this.readOnlyMode) {
            return false;
        }

        return (this.studentForm && this.studentForm.dirty);
    }

    public setData = (student: StudentInterface) => {
        this.student = student;
        this.setDropdownValues();
    }
}
