import { FormComponent } from '../offer/formComponent.component';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from '../../utils/customValidators';
import { InfoJobOfferInterface } from '../interfaces/jobOffer.interface';
import { MessageServices } from '../../services/message.services';
import { Constants } from '../../utils/constans';
import { markAllFormControlsAsTouched, filterDigitsOnly, toDate, dateObjectToIMyDate } from '../../utils/utils';
import { IMyOptions, MyDatePicker, IMyDate } from 'mydatepicker';
import { TimeInterface } from '../interfaces/dateTime.interface';
import { getFormattedTime } from '../../utils/utils';
import { TransactionStateInterface } from '../interfaces/offer.interface';

declare var $: any;

@Component({
    selector: 'infoJobOffer',
    templateUrl: 'infoJobOffer.component.html',
    styles: [`div.center-text{text-align: center}`]
})
export class InfoJobOffer implements FormComponent, OnInit {
    @Input() isSummaryMode: boolean;

    @ViewChild('limitedPeriodFromDate') limitedPeriodFromDateMyDatePicker: MyDatePicker;
    @ViewChild('limitedPeriodToDate') limitedPeriodToDateMyDatePicker: MyDatePicker;

    @ViewChild('isPartialCheckBox') isPartialCheckBox: ElementRef;

    readOnlyMode: boolean = false;

    infoJobOfferForm: FormGroup;
    infoJobOffer: InfoJobOfferInterface = <InfoJobOfferInterface>{};
    transactionState: TransactionStateInterface;

    messages = null;
    validationErrorMessage: string;

    ccyArr: { value: string, desc: string }[];

    accordionTitle: string = "Generic Info";

    filterDigitsOnly: Function = filterDigitsOnly; //required in order to use it in html template
    getFormattedTime: Function = getFormattedTime;
    dateObjectToIMyDate: Function = dateObjectToIMyDate;

    //date picker related
    datePickerOptions: IMyOptions = { dateFormat: Constants.SHORT_DATE_PATTERN, height: "29px", selectionTxtFontSize: "14px", openSelectorTopOfInput: true, showSelectorArrow: false };
    disabledDatePickerOptions: IMyOptions = { componentDisabled: true, showClearDateBtn: false, dateFormat: Constants.SHORT_DATE_PATTERN, height: "29px", selectionTxtFontSize: "14px" };
    language: string = Constants.LOCALE_LANGUAGE_ONLY;

    isValid = (): boolean => {
        if (this.infoJobOfferForm.valid) {
            return true;
        }

        markAllFormControlsAsTouched(this.infoJobOfferForm);
        return false;
    }

    isDirty = (): boolean => {
        if (this.readOnlyMode) {
            return false;
        }
        return this.infoJobOfferForm.dirty;
    }

    getFormData = (): InfoJobOfferInterface => {
        return this.infoJobOffer;
    }

    clearFormData = (): void => {
        //important to clear date pickers before reseting the form
        this.limitedPeriodFromDateMyDatePicker.clearDate();
        this.limitedPeriodToDateMyDatePicker.clearDate();

        this.infoJobOfferForm.reset({ isPartial: false, createDate: new Date(), workingHoursFrom: <TimeInterface>{}, workingHoursTo: <TimeInterface>{} });
    }

    constructor(private formBuilder: FormBuilder, private messageServices: MessageServices) {
        this.messageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.validationErrorMessage = resultMessage });
    }

    init() {
        this.infoJobOffer.createDate = new Date();
        if (this.infoJobOfferForm) {
            this.infoJobOfferForm.controls['createDate'].setValue(this.infoJobOffer.createDate);
        }
        this.infoJobOffer.status = 'New';

        this.infoJobOffer.workingHoursFrom = <TimeInterface>{};
        this.infoJobOffer.workingHoursTo = <TimeInterface>{};

        if (this.infoJobOffer.isPartial == undefined || this.infoJobOffer.isPartial == null) {
            this.infoJobOffer.isPartial = false;
        }
        $(this.isPartialCheckBox.nativeElement).checkbox();
    }

    setData(infoJobOffer: InfoJobOfferInterface, isReadOnlyMode: boolean, transactionState?: TransactionStateInterface) {
        this.transactionState = transactionState;
        this.readOnlyMode = isReadOnlyMode;

        if (this.readOnlyMode) {
            this.infoJobOfferForm.disable();
        }

        //Ensure that the date properties contain Date type objects and select the date pickers with the values
        infoJobOffer.limitedPeriodFromDate = toDate(infoJobOffer.limitedPeriodFromDate);
        this.setDatePickerDateAndDisable(this.limitedPeriodFromDateMyDatePicker, infoJobOffer.limitedPeriodFromDate, this.readOnlyMode);
        this.infoJobOfferForm.controls['limitedPeriodFromDate'].markAsUntouched();

        infoJobOffer.limitedPeriodToDate = toDate(infoJobOffer.limitedPeriodToDate);
        this.setDatePickerDateAndDisable(this.limitedPeriodToDateMyDatePicker, infoJobOffer.limitedPeriodToDate, this.readOnlyMode);
        this.infoJobOfferForm.controls['limitedPeriodToDate'].markAsUntouched();

        infoJobOffer.createDate = toDate(infoJobOffer.createDate);

        if (!infoJobOffer.workingHoursFrom) {
            infoJobOffer.workingHoursFrom = <TimeInterface>{};
        }
        if (!infoJobOffer.workingHoursTo) {
            infoJobOffer.workingHoursTo = <TimeInterface>{};
        }

        this.infoJobOffer = infoJobOffer;

        //Set the form as pristine
        this.infoJobOfferForm.markAsPristine();
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

        this.infoJobOfferForm = this.formBuilder.group({
            createDate: new FormControl({ disabled: true }, Validators.compose([Validators.required, CustomValidators.notEmptyObject, Validators.maxLength(15)])),
            name: new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(50), CustomValidators.notEmptyString])),
            jobBrief: new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(500), CustomValidators.notEmptyString])),
            responsibilities: new FormControl({}, Validators.compose([Validators.required, /*Validators.maxLength(100),*/ CustomValidators.notEmptyString])),
            requirements: new FormControl({}, Validators.compose([Validators.required, /*Validators.maxLength(100),*/ CustomValidators.notEmptyString])),
            isPartial: new FormControl({}, Validators.compose([Validators.required])),
            weeklyWorkingHours: new FormControl({}, Validators.compose([CustomValidators.emptyOrPositiveIntegerValidator, Validators.maxLength(2)])),
            workingHoursFrom: new FormControl({}, Validators.compose([CustomValidators.validTime])),
            workingHoursTo: new FormControl({}, Validators.compose([CustomValidators.validTime])),
            limitedPeriodFromDate: new FormControl({}, Validators.compose([Validators.maxLength(15)])),
            limitedPeriodToDate: new FormControl({}, Validators.compose([Validators.maxLength(15)])),
            workPlace: new FormControl({}, Validators.compose([Validators.required, /*Validators.maxLength(100),*/ CustomValidators.notEmptyString])),
        }, { validator: this.datesValidator })
    }

    datesValidator = () => {
        if (!this.infoJobOffer) {
            return null;
        }

        let fromDate: Date = this.infoJobOffer.limitedPeriodFromDate;
        let toDate: Date = this.infoJobOffer.limitedPeriodToDate;

        if (!fromDate || !toDate) {
            return null;
        }

        if (fromDate.getTime() > toDate.getTime()) {
            return { isValid: false };
        }

        return null;
    }

    isInvalid(fieldName: string): boolean {
        return (this.infoJobOfferForm.controls[fieldName].touched && !this.infoJobOfferForm.controls[fieldName].valid);
    }

}