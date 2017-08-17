import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConstraintsComponent } from './constraints.component';
import { NumericConstraintsInterface } from '../../interfaces/fieldMetadata.interface';
import { filterDigitsOnly, isNumber } from '../../../utils/utils';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageServices } from '../../../services/message.services';
import { markAllFormControlsAsTouched } from '../../../utils/utils';
import { Constants } from '../../../utils/constans';

@Component({
    selector: 'numericConstraints',
    template:
    `
    <form [formGroup]="numericConstraintsForm" class="ui tiny form">
        <div class="ui equal width grid">
            <div class="field inline column" style="margin-bottom: 0">
                <label>From</label>
                <input type="text" name="from" maxlength="20" (keypress)="filterDigitsOnly($event)" placeholder="From" [(ngModel)]="constraints.minValue" style="width: 70%"
                    class="form-control ui input" formControlName="minValue">
            </div>
            
            <div class="field inline column" style="margin-bottom: 0">
                <label>To</label>        
                <input type="text" name="to" maxlength="20" (keypress)="filterDigitsOnly($event)" placeholder="To" [(ngModel)]="constraints.maxValue" style="width: 70%"
                    class="form-control ui input" formControlName="maxValue">
            </div>

            <div *ngIf="numericConstraintsForm.invalid && numericConstraintsForm.controls['minValue'].valid && numericConstraintsForm.controls['maxValue'].valid" 
                  class="ui tiny red pointing above label centered row" style="margin-top: 0">{{errorMessage}}</div>
        </div>                  
    </form>
    `
})
export class NumericConstraints implements ConstraintsComponent, OnInit, OnChanges {
    @Input('constraints') constraints: NumericConstraintsInterface;
    @Input('isDisabled') isDisabled: boolean;

    filterDigitsOnly: Function = filterDigitsOnly; //required in order to use it in html template
    numericConstraintsForm: FormGroup;

    errorMessage: string;

    constructor(private formBuilder: FormBuilder, private messageServices: MessageServices) { 
        this.messageServices.getMessage(Constants.MESSAGE_FROM_LESS_THAN_TO, (resultMessage: string) => { this.errorMessage = resultMessage });
    }

    ngOnInit() {
        this.numericConstraintsForm = this.formBuilder.group({
            minValue: new FormControl({ value: this.constraints.minValue, disabled: this.isDisabled }, Validators.compose([Validators.maxLength(20)])),
            maxValue: new FormControl({ value: this.constraints.maxValue, disabled: this.isDisabled }, Validators.compose([Validators.maxLength(20)])),
        }, { validator: NumericConstraints.fromToValidator });
    }

    isValid(): boolean {
        if (this.numericConstraintsForm.status == 'DISABLED'){
            return true;
        }
        markAllFormControlsAsTouched(this.numericConstraintsForm);
        return this.numericConstraintsForm.valid;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.numericConstraintsForm) {
            if (changes['isDisabled'] && changes['isDisabled'].previousValue != changes['isDisabled'].currentValue) {
                const currentIsDisabled: boolean = changes['isDisabled'].currentValue;
                for (let fieldName in this.numericConstraintsForm.controls) {
                    const formControl: FormControl = <FormControl>this.numericConstraintsForm.controls[fieldName];
                    currentIsDisabled ? formControl.disable() : formControl.enable();
                }
            }

            if (changes['constraints']) {
                this.numericConstraintsForm.reset({ minValue: this.constraints.minValue, maxValue: this.constraints.maxValue });
            }
        }
    }

    static fromToValidator(group: FormGroup): any {
        let minValue = group.controls['minValue'];
        let maxValue = group.controls['maxValue'];

        // Don't kick in until user defines maxLenght field
        if (minValue.pristine && maxValue.pristine) {
            return null;
        }

        if (!isNumber(minValue.value) || !isNumber(maxValue.value)) {
            return null;
        }

        if (+minValue.value >= +maxValue.value) {
            return { isValid: false };
        }
    }
}