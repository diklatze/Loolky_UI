import { FormComponent } from '../offer/formComponent.component';
import { Component, Input, OnInit, SimpleChanges, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from '../../utils/customValidators';
import { InfoScholarshipInterface } from '../interfaces/scholarship.interface';
import { MessageServices } from '../../services/message.services';
import { Constants } from '../../utils/constans';
import { UtilsServices } from '../../services/utils.services';
import { markAllFormControlsAsTouched, filterDigitsOnly, toDate, dateObjectToIMyDate } from '../../utils/utils';
import { IMyOptions, MyDatePicker, IMyDate } from 'mydatepicker';
import { TransactionStateInterface } from '../interfaces/offer.interface';

declare var $: any;

@Component({
    selector: 'infoScholarship',
    templateUrl: 'infoScholarship.component.html',
    providers: [UtilsServices],
})
export class InfoScholarship implements FormComponent, OnInit, OnChanges {
    @Input() isSummaryMode: boolean;

    @ViewChild('openDate') openDateMyDatePicker: MyDatePicker;
    @ViewChild('publishResultDate') publishResultDateMyDatePicker: MyDatePicker;
    @ViewChild('applicationDeadlineDate') applicationDeadlineDateMyDatePicker: MyDatePicker;

    @ViewChild('currencyCombo') currencyComboElementRef: ElementRef;

    readOnlyMode: boolean = false;

    infoScholarshipForm: FormGroup;
    infoScholarship: InfoScholarshipInterface = <InfoScholarshipInterface>{};
    transactionState: TransactionStateInterface;

    messages = null;
    validationErrorMessage: string;

    ccyArr: { value: string, desc: string }[];

    accordionTitle: string = "Generic Info";

    filterDigitsOnly: Function = filterDigitsOnly; //required in order to use it in html template
    dateObjectToIMyDate: Function = dateObjectToIMyDate;

    //date picker related
    datePickerOptions: IMyOptions = { dateFormat: Constants.SHORT_DATE_PATTERN, height: "29px", selectionTxtFontSize: "14px" };
    disabledDatePickerOptions: IMyOptions = { componentDisabled: true, showClearDateBtn: false, dateFormat: Constants.SHORT_DATE_PATTERN, height: "29px", selectionTxtFontSize: "14px" };
    language: string = Constants.LOCALE_LANGUAGE_ONLY;

    isValid = (): boolean => {
        if (this.infoScholarshipForm.valid) {
            return true;
        }

        markAllFormControlsAsTouched(this.infoScholarshipForm);
        return false;
    }

    isDirty = (): boolean => {
        if (this.readOnlyMode) {
            return false;
        }
        return this.infoScholarshipForm.dirty;
    }

    getFormData = (): InfoScholarshipInterface => {
        return this.infoScholarship;
    }

    clearFormData = (): void => {
        //important to clear date pickers before reseting the form
        this.openDateMyDatePicker.clearDate();
        this.publishResultDateMyDatePicker.clearDate();
        this.applicationDeadlineDateMyDatePicker.clearDate();

        this.infoScholarshipForm.reset();
        this.init();
        $(this.currencyComboElementRef.nativeElement).dropdown('clear');
    }

    constructor(private formBuilder: FormBuilder, private messageServices: MessageServices, utilsServices: UtilsServices) {
        this.messageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.validationErrorMessage = resultMessage });
        utilsServices.getListOfCurrencies().subscribe(
            res => { this.ccyArr = res },
            err => {
                console.error('Info Scholarship: Error occured on getListOfCurrencies');
                console.error(err);
            });
    }

    init() {
        this.infoScholarship.createDate = new Date();
        if (this.infoScholarshipForm) {
            this.infoScholarshipForm.controls['createDate'].setValue(this.infoScholarship.createDate);
        }
        this.infoScholarship.status = 'New';
    }

    setData(infoScholarship: InfoScholarshipInterface, isReadOnlyMode: boolean, transactionState?: TransactionStateInterface) {
        this.transactionState = transactionState;
        this.readOnlyMode = isReadOnlyMode;

        if (this.readOnlyMode) {
            this.infoScholarshipForm.disable();
        }

        //Ensure that the date properties contain Date type objects and select the date pickers with the values
        infoScholarship.applicationDeadline = toDate(infoScholarship.applicationDeadline);
        this.setDatePickerDateAndDisable(this.applicationDeadlineDateMyDatePicker, infoScholarship.applicationDeadline, this.readOnlyMode);
        this.infoScholarshipForm.controls['applicationDeadline'].markAsUntouched();

        infoScholarship.openDate = toDate(infoScholarship.openDate);
        this.setDatePickerDateAndDisable(this.openDateMyDatePicker, infoScholarship.openDate, this.readOnlyMode);
        this.infoScholarshipForm.controls['openDate'].markAsUntouched();


        infoScholarship.publishResultDate = toDate(infoScholarship.publishResultDate);
        this.setDatePickerDateAndDisable(this.publishResultDateMyDatePicker, infoScholarship.publishResultDate, this.readOnlyMode);
        this.infoScholarshipForm.controls['publishResultDate'].markAsUntouched();

        infoScholarship.createDate = toDate(infoScholarship.createDate);

        this.infoScholarship = infoScholarship;

        //Set the form as pristine
        this.infoScholarshipForm.markAsPristine();
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
        this.init();

        this.infoScholarshipForm = this.formBuilder.group({
            createDate: new FormControl({ disabled: true }, Validators.compose([Validators.required, CustomValidators.notEmptyObject, Validators.maxLength(15)])),
            name: new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(50), CustomValidators.notEmptyString])),
            description: new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(500), CustomValidators.notEmptyString])),
            openDate: new FormControl({}, Validators.compose([Validators.required, CustomValidators.notEmptyObject, Validators.maxLength(15)])),
            publishResultDate: new FormControl({}, Validators.compose([Validators.required, CustomValidators.notEmptyObject, Validators.maxLength(15)])),
            applicationDeadline: new FormControl({}, Validators.compose([Validators.required, CustomValidators.notEmptyObject, Validators.maxLength(15)])),
            maxAmount: new FormControl({}, Validators.compose([Validators.required, CustomValidators.emptyOrPositiveIntegerValidator, Validators.maxLength(9)])),
            ccy: new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(3)])),
            numberOfAwards: new FormControl({}, Validators.compose([Validators.required, CustomValidators.emptyOrPositiveIntegerValidator, Validators.maxLength(3)])),
        })
    }


    isInvalid(fieldName: string): boolean {
        return (this.infoScholarshipForm.controls[fieldName].touched && !this.infoScholarshipForm.controls[fieldName].valid);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isSummaryMode'] && changes['isSummaryMode'].currentValue == false) {
            setTimeout(() => { $(this.currencyComboElementRef.nativeElement).dropdown(); });
        }
    }
}