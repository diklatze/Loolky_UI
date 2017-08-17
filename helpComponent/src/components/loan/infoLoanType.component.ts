import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { InfoLoanTypeInterface, LoanTypeMetaDataInterface, ItemInterface } from '../interfaces/loan.interface';
import { CustomValidators } from '../../utils/customValidators';
import { NavController, NavParams } from 'ionic-angular';
import { UserType, Constants } from '../../utils/constans';
import { MessageServices } from '../../services/message.services';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { MemberServices } from '../../services/member.services';
import { PageService } from '../pageHeader/page.service';
import { markAllFormControlsAsTouched, filterDigitsOnly, toDate, dateObjectToIMyDate } from '../../utils/utils';
import { FormComponent } from '../offer/formComponent.component';
import { IMyOptions, MyDatePicker, IMyDate } from 'mydatepicker';
import { TransactionStateInterface } from '../interfaces/offer.interface';

declare var $: any;

@Component({
    selector: 'infoLoanType',
    templateUrl: 'infoLoanType.component.html',
    styles: [`.top-aligned {vertical-align: top;}`]
})

export class InfoLoanType implements FormComponent, OnInit {
    @Input() isSummaryMode: boolean;

    @ViewChild('createDate') createDateMyDatePicker: MyDatePicker;
    @ViewChild('openDate') openDateMyDatePicker: MyDatePicker;
    @ViewChild('deadlineDate') deadlineDateMyDatePicker: MyDatePicker;

    @ViewChild('typeCombo') typeComboElementRef: ElementRef;
    @ViewChild('categoryCombo') categoryComboElementRef: ElementRef;
    @ViewChild('residencyCombo') residencyComboElementRef: ElementRef;

    governmentName: string;

    accordionTitle: string = "Generic Info";

    metadataInitialized: boolean = false;
    viewMode: boolean = false;
    combosPopulated: boolean = false;
    readOnlyMode: boolean = false;

    messages = null;
    infoLoanTypeForm: FormGroup;
    validationErrorMessage: string;

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    residence: ItemInterface;

    //Otherwise you cannot use it inside html template
    filterDigitsOnly: Function = filterDigitsOnly;

    metadata: LoanTypeMetaDataInterface = {
        currency: "",
        categories: [],
        residencies: [],
        types: []
    }

    infoLoanType: InfoLoanTypeInterface = <InfoLoanTypeInterface>{};
    transactionState: TransactionStateInterface;
    categoriesArr: ItemInterface[] = [];

    //date picker related
    datePickerOptions: IMyOptions = { dateFormat: Constants.SHORT_DATE_PATTERN };
    disabledDatePickerOptions: IMyOptions = { componentDisabled: true, showClearDateBtn: false, dateFormat: Constants.SHORT_DATE_PATTERN };
    language: string = Constants.LOCALE_LANGUAGE_ONLY;

    constructor(private memberServices: MemberServices, private _formBuilder: FormBuilder, private _MessageServices: MessageServices, private nav: NavController, private pageService: PageService, navParams: NavParams) {
        this.memberServices.getLoanTypeMetadata(this.pageService.getMember().shortName).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.metadata = res.body;

                        if (!this.metadata.categories || this.metadata.categories.length == 0) {
                            this.showModal(Constants.MESSAGE_PLEASE_DEFINE_CATEGORIES, this.navBackCallback);
                        }
                        else {
                            this.initCombos();
                            this.metadataInitialized = true;
                            if (this.viewMode) {
                                this.populateCombos();
                            }
                        }
                        break;

                    case 591:
                        this.showModal(Constants.MESSAGE_PLEASE_DEFINE_CATEGORIES, this.navBackCallback);
                        break;

                    case 590:
                        //You must be registered before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_BE_REGISTERED, this.navBackCallback, undefined, [this.governmentName]);
                        break;

                    case 586:
                        //You must create an account before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_CREATE_ACCT, this.navBackCallback, undefined, [this.governmentName]);
                        break;

                    default:
                        console.error('Failed to load Loan Type metadata. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Failed to load Loan Type metadata');
                console.error(err);
            });

        this.governmentName = this.pageService.getMember().fullName;
        this._MessageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.validationErrorMessage = resultMessage });
    }

    isValid(): boolean {
        if (this.infoLoanTypeForm.valid) {
            return true;
        }

        markAllFormControlsAsTouched(this.infoLoanTypeForm);
        return false;
    }

    isDirty = (): boolean => {
        if (this.readOnlyMode) {
            return false;
        }
        return this.infoLoanTypeForm.dirty;
    }

    clearFormData = (): void => {
        this.infoLoanTypeForm.reset({ status: 'New' });
        this.initDates();
        this.categoriesArr = [];
        $(this.typeComboElementRef.nativeElement).dropdown('clear');
        $(this.categoryComboElementRef.nativeElement).dropdown('clear');
        $(this.residencyComboElementRef.nativeElement).dropdown('clear');
        this.messages = null;
    }

    getFormData = (): InfoLoanTypeInterface => {
        this.infoLoanType.residencies = this.getResidenciesArr();
        this.infoLoanType.categories = this.categoriesArr;
        return this.infoLoanType;
    }

    setData = (infoLoanType: InfoLoanTypeInterface, isReadOnlyMode: boolean, transactionState?: TransactionStateInterface): void => {
        this.transactionState = transactionState;
        this.viewMode = true;
        this.readOnlyMode = isReadOnlyMode;

        if (this.readOnlyMode) {
            this.infoLoanTypeForm.disable();
        }

        //Ensure that the date properties contain Date type objects and select the date pickers with the values
        infoLoanType.deadlineDate = toDate(infoLoanType.deadlineDate);
        this.setDatePickerDateAndDisable(this.deadlineDateMyDatePicker, infoLoanType.deadlineDate, this.readOnlyMode);
        this.infoLoanTypeForm.controls['deadlineDate'].markAsUntouched();

        infoLoanType.openDate = toDate(infoLoanType.openDate);
        this.setDatePickerDateAndDisable(this.openDateMyDatePicker, infoLoanType.openDate, this.readOnlyMode);
        this.infoLoanTypeForm.controls['openDate'].markAsUntouched();

        infoLoanType.createDate = toDate(infoLoanType.createDate);

        this.infoLoanType = infoLoanType;

        if (this.metadataInitialized) {
            this.populateCombos();
        }

        //Set the form as pristine
        this.infoLoanTypeForm.markAsPristine();
    }

    populateCombos() {
        if (this.combosPopulated) {
            return;
        }
        this.combosPopulated = true;

        setTimeout(() => {
            this.populateComboValue(this.typeComboElementRef.nativeElement, [this.infoLoanType.type]);

            let residenciesValArr: string[] = [];
            this.infoLoanType.residencies.forEach(residency => {
                residenciesValArr.push(residency.code);
            });

            this.populateComboValue(this.residencyComboElementRef.nativeElement, residenciesValArr);


            let categoriesValArr: string[] = [];
            this.infoLoanType.categories.forEach(category => {
                categoriesValArr.push(category.code);
            });

            this.populateComboValue(this.categoryComboElementRef.nativeElement, categoriesValArr);
        });
    }

    populateComboValue = (comboNativeElement: any, value: any[]): void => {
        $(comboNativeElement).dropdown("set selected", value);
        //this.readOnly ? $(comboNativeElement).addClass('disabled') : $(comboNativeElement).removeClass('disabled')
    }

    setDatePickerDateAndDisable(datePicker: MyDatePicker, date: Date, isDisabled: boolean) {
        if (date) {
            let iMyDate: IMyDate = dateObjectToIMyDate(date);
            datePicker.selectDate(iMyDate, 0);
        }
        datePicker.options.componentDisabled = isDisabled;
        datePicker.setOptions();
    }

    ngOnInit() {
        this.initDates();
        this.infoLoanType.status = 'New';
        this.infoLoanTypeForm = this._formBuilder.group({
            createDate: new FormControl({ disabled: true }, Validators.compose([Validators.required, Validators.maxLength(15)])),
            status: new FormControl({ value: 'New', disabled: true }, Validators.required),
            loanCode: new FormControl({ value: '', disabled: this.readOnlyMode }, Validators.compose([Validators.required, Validators.maxLength(10), CustomValidators.alphaNumericValidator])),
            name: new FormControl({ value: '', disabled: this.readOnlyMode }, Validators.compose([Validators.required, Validators.maxLength(50), CustomValidators.notEmptyString])),
            description: new FormControl({ value: '', disabled: this.readOnlyMode }, Validators.compose([Validators.required, Validators.maxLength(500), CustomValidators.notEmptyString])),
            type: new FormControl({ value: '', disabled: this.readOnlyMode }, Validators.compose([Validators.required])),
            openDate: new FormControl({ value: '', disabled: this.readOnlyMode }, Validators.compose([Validators.required, Validators.maxLength(15)])),
            deadlineDate: new FormControl({ value: '', disabled: this.readOnlyMode }, Validators.compose([Validators.required, Validators.maxLength(15)])),
            amount: new FormControl({ value: '', disabled: this.readOnlyMode }, Validators.compose([Validators.required])),
            categories: new FormControl({ value: '', disabled: this.readOnlyMode }, Validators.compose([Validators.required])),
            residencies: new FormControl({ value: '', disabled: this.readOnlyMode }, Validators.compose([Validators.required])),
            percentOfStudiesFrom: new FormControl({ value: '', disabled: this.readOnlyMode }, Validators.compose([Validators.maxLength(3), CustomValidators.percentValidator])),
            percentOfStudiesTo: new FormControl({ value: '', disabled: this.readOnlyMode }, Validators.compose([Validators.maxLength(3), CustomValidators.percentValidator])),
        }, { validator: this.additionalFormValidator });
    }

    initDates(): void {
        if (!this.viewMode) {
            let currentDate: Date = new Date();
            this.infoLoanType.openDate = currentDate;
            this.infoLoanType.createDate = currentDate;
            this.infoLoanType.deadlineDate = null;
        }
    }

    initCombos() {
        $(this.typeComboElementRef.nativeElement).dropdown();

        $(this.categoryComboElementRef.nativeElement).dropdown({
            silent: true,
            forceSelection: false, //disable force selection when dropdown menu is opened and clicking outside selects value
            onAdd: (addedValue, addedText, $addedChoice) => { //selecting 'All' option should disable selection of other options
                if (addedValue == -1) {
                    $(this.categoryComboElementRef.nativeElement).dropdown('clear');
                    $(this.categoryComboElementRef.nativeElement).addClass('all-selected');
                    this.categoriesArr = [{ code: "-1", name: "All" }];
                }
                else if ($(this.categoryComboElementRef.nativeElement).hasClass('all-selected')) {
                    setTimeout(() => {
                        $(this.categoryComboElementRef.nativeElement).dropdown('clear');
                        $(this.categoryComboElementRef.nativeElement).dropdown('set selected', -1);
                    });
                }
                else {
                    this.categoriesArr.push({ code: addedValue, name: addedText });
                }
            },
            onRemove: (removedValue, removedText, $removedChoice) => {
                if (removedValue == -1) {
                    $(this.categoryComboElementRef.nativeElement).removeClass('all-selected');
                    this.categoriesArr = <[ItemInterface]>[];
                }
                else {
                    this.categoriesArr.filter((value: ItemInterface, index: number, array: ItemInterface[]) => {
                        return value.name == removedValue;
                    }
                    );
                }
            },
        });

        $(this.residencyComboElementRef.nativeElement).dropdown({
            silent: true,
            forceSelection: false //disable force selection when dropdown menu is opened and clicking outside selects value
        });
    }

    additionalFormValidator = (): any => {
        if (this.pageService.getUsertype() == UserType.Student.toString() && (this.isInvalidDates() || this.isInvalidPercentage())) {
            return { isValid: false };
        }
    }

    isInvalidDates(): boolean {
        let dateBefore: Date = this.infoLoanType.openDate;
        let dateAfter: Date = this.infoLoanType.deadlineDate;

        if (!dateBefore || !dateAfter) {
            return false;
        }

        return dateBefore.getTime() > dateAfter.getTime();
    }

    isInvalidPercentage(): boolean {
        return (+this.infoLoanType.percentOfStudiesFrom > +this.infoLoanType.percentOfStudiesTo);
    }

    getDateForDatePicker(dateFieldName: string): any {
        if (this.infoLoanType[dateFieldName]) {
            return { date: { year: this.infoLoanType[dateFieldName].getFullYear(), month: this.infoLoanType[dateFieldName].getMonth() + 1, day: this.infoLoanType[dateFieldName].getDate() } }
        }
        return '';
    }

    getResidenciesArr(): ItemInterface[] {
        if (!this.metadataInitialized) {
            return [];
        }

        let residenciesIndexesArr = $(this.residencyComboElementRef.nativeElement).dropdown('get value');
        let residenciesArr: ItemInterface[] = [];

        if (residenciesIndexesArr && residenciesIndexesArr[residenciesIndexesArr.length - 1]) {
            residenciesIndexesArr = residenciesIndexesArr[residenciesIndexesArr.length - 1];
            residenciesIndexesArr.forEach(residencyIndex => {
                let residency = this.metadata.residencies[residencyIndex];
                residenciesArr.push(residency);
            });
        }

        return residenciesArr;
    }

    private navBackCallback = (): void => {
        this.messageModalShown = false; //close the modal
        this.nav.popToRoot();
    }

    isInvalid(fieldName: string): boolean {
        return (this.infoLoanTypeForm.controls[fieldName].touched && !this.infoLoanTypeForm.controls[fieldName].valid);
    }

    showModal(messageId: string, callbackFunction1: Function, callbackFunction2?: Function, messageParameters?: [string]): void {
        this._MessageServices.getMessage(messageId, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, messageParameters);
        this.actions = ModalMessage.getModalActionsPattern(callbackFunction1, callbackFunction2); //get actions for modal message screen
        this.messageModalShown = true; //show the modal
    }
}