import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RepresentationComponent } from './representation.component';
import { FieldMetadataValueInterface } from '../../interfaces/fieldMetadata.interface';
import { isNullOrUndefined, dateObjectToIMyDate, toDate } from '../../../utils/utils';
// import { MessageServices } from '../../../services/message.services';
import { Constants } from '../../../utils/constans';
import { IMyOptions, IMyDate, MyDatePicker } from 'mydatepicker';

@Component({
    selector: 'dateRepresentation',
    template:
    `
    <my-date-picker #datePicker [id]="fieldMetadata.name" [locale]="language" [options]="datePickerOptions" class="auto-width-selector"
        [placeholder]="fieldMetadata.name" (dateChanged)="value=$event.jsdate"></my-date-picker>
    `
})
export class DateRepresentation implements RepresentationComponent, AfterViewInit {
    @Input('fieldMetadata') fieldMetadata: FieldMetadataValueInterface;
    @ViewChild('datePicker') datePicker: MyDatePicker;

    //disableSince
    //disableUntil
    datePickerOptions: IMyOptions = { dateFormat: Constants.SHORT_DATE_PATTERN, /*width: "70%",*/ height: "25px", selectionTxtFontSize: "12px" };
    language: string = Constants.LOCALE_LANGUAGE_ONLY;

    value: Date;

    // constructor(private messageServices: MessageServices) {
    //     //this.messageServices.getMessage(Constants.MESSAGE_FROM_LESS_THAN_TO, (resultMessage: string) => { this.errorMessage = resultMessage });
    // }

    ngAfterViewInit() {
        let date: Date = toDate(this.fieldMetadata.value);
        if (date) {
            let iMyDate: IMyDate = dateObjectToIMyDate(date);
            this.value = date;
            this.datePicker.selectDate(iMyDate, 0);
        }
    }

    isValid(): boolean {
        return (!this.fieldMetadata.isMandatory || (this.fieldMetadata.isMandatory && !isNullOrUndefined(this.value)));
    }

    getData(): Date {
        return this.value;
    }
}