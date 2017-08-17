import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ConstraintsComponent } from './constraints.component';
import { DateConstraintsInterface } from '../../interfaces/fieldMetadata.interface';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageServices } from '../../../services/message.services';
import { Constants } from '../../../utils/constans';
import { IMyOptions, MyDatePicker } from 'mydatepicker';
import { markAllFormControlsAsTouched } from '../../../utils/utils';

@Component({
    selector: 'dateConstraints',
    template:
    `
    <form [formGroup]="dateConstraintsForm" class="ui tiny form">
        <div class="ui equal width grid">
            <div class="field inline column" style="margin-bottom: 0">
                <label style="vertical-align: 100%;">From</label>
                    <my-date-picker #minDate name="from" [locale]="language" [options]="datePickerOptions" class="auto-width-selector form-control" formControlName="minDate"
                        [ngClass]="{'disabled':isDisabled}" placeholder="From" (dateChanged)="constraints.minDate=$event.jsdate" [ngModel]="getDateForDatePicker('minDate')"></my-date-picker>
            </div>
            
            <div class="field inline column" style="margin-bottom: 0">
                <label style="vertical-align: 100%;">To</label>        
                     <my-date-picker #maxDate name="to" [locale]="language" [options]="datePickerOptions" class="auto-width-selector form-control" formControlName="maxDate"
                        [ngClass]="{'disabled':isDisabled}" placeholder="To" (dateChanged)="constraints.maxDate=$event.jsdate" [ngModel]="getDateForDatePicker('maxDate')"></my-date-picker>
            </div>
            <div *ngIf="dateConstraintsForm.invalid && dateConstraintsForm.controls['minDate'].valid && dateConstraintsForm.controls['maxDate'].valid" 
                  class="ui tiny red pointing above label centered row" style="margin-top: 0">{{errorMessage}}</div>
        </div>                  
    </form>
    `
})

export class DateConstraints implements ConstraintsComponent, OnInit, OnChanges {
    @Input('isDisabled') isDisabled: boolean;
    @Input('constraints') constraints: DateConstraintsInterface;
    
    @ViewChild('minDate') minDateMyDatePicker: MyDatePicker;
    @ViewChild('maxDate') maxDateMyDatePicker: MyDatePicker;

    dateConstraintsForm: FormGroup;

    errorMessage: string;

    //date picker related
    datePickerOptions: IMyOptions = { componentDisabled: this.isDisabled, dateFormat: Constants.SHORT_DATE_PATTERN, width: "70%", height: "25px", selectionTxtFontSize: "12px" };
    language: string = Constants.LOCALE_LANGUAGE_ONLY;

    constructor(private formBuilder: FormBuilder, private messageServices: MessageServices) {
        this.messageServices.getMessage(Constants.MESSAGE_FROM_LESS_THAN_TO, (resultMessage: string) => { this.errorMessage = resultMessage });
    }

    ngOnInit() {
        this.dateConstraintsForm = this.formBuilder.group({
            minDate: new FormControl(),
            maxDate: new FormControl(),
        }, { validator: this.minMaxDatesValidator });
    }

    isValid(): boolean {
        if (this.dateConstraintsForm.status == 'DISABLED') {
            return true;
        }
        markAllFormControlsAsTouched(this.dateConstraintsForm);
        return this.dateConstraintsForm.valid;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isDisabled']) {
            this.datePickerOptions.componentDisabled = this.isDisabled;
            if (this.minDateMyDatePicker && this.maxDateMyDatePicker) {
                this.minDateMyDatePicker.setOptions();
                this.maxDateMyDatePicker.setOptions();
            }
        }

        if (changes['constraints'] && this.dateConstraintsForm) {
            this.dateConstraintsForm.reset();
        }
    }

    minMaxDatesValidator = (group): any => {
        // Don't kick in until both dates were touched
        if (group.controls['minDate'].pristine || group.controls['maxDate'].pristine) {
            return null;
        }

        if (!this.constraints.minDate || !this.constraints.maxDate) {
            return null;
        }
        return (+this.constraints.minDate < +this.constraints.maxDate) ? null : { isValid: false };
    }

    getDateForDatePicker(dateFieldName: string): any {
        if (this.constraints[dateFieldName]) {
            return { date: { year: this.constraints[dateFieldName].getFullYear(), month: this.constraints[dateFieldName].getMonth() + 1, day: this.constraints[dateFieldName].getDate() } }
        }
        return '';
    }
}