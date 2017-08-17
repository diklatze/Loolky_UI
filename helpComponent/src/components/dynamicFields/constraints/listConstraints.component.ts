import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConstraintsComponent } from './constraints.component';
import { ListConstraintsInterface, LIST_VALUES_DELIMITER } from '../../interfaces/fieldMetadata.interface';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MessageServices } from '../../../services/message.services';
import { markAllFormControlsAsTouched } from '../../../utils/utils';
import { Constants } from '../../../utils/constans';

const ERROR_DUPLICATION: string = "err_duplicate";
const ERROR_NOT_ENOUGH_VALUES: string = "err_not_enough_values";

@Component({
    selector: 'listConstraints',
    template:
    `
    <form [formGroup]="listConstraintsForm" class="ui tiny form">
        <div class="ui equal width grid">
                <div class="field column" style="margin-bottom: 0">
                    <textarea style="width: 90%" rows="1" name="valuesList" class="form-control ui input" maxlength="500" placeholder="Pipe separated values" [ngClass]="{'disabled': isDisabled}"
                            [ngModel]="this.arrayToDelimiterSeparated(constraints.listOfValues)" (ngModelChange)="delimiterSeparatedToArray($event)" formControlName="valuesList">
                    </textarea>
                    <div *ngIf="this.listConstraintsForm.hasError('ERROR_DUPLICATION')" class="ui tiny red pointing above label centered row">{{msgDuplicateValue}}</div>
                    <div *ngIf="this.listConstraintsForm.hasError('ERROR_NOT_ENOUGH_VALUES')" class="ui tiny red pointing above label centered row">{{msgNotEnoughValues}}</div>
               </div>
        </div>
    </form>
    `
})

export class ListConstraints implements ConstraintsComponent, OnInit, OnChanges {
    @Input('constraints') constraints: ListConstraintsInterface;
    @Input('isDisabled') isDisabled: boolean;

    listConstraintsForm: FormGroup;

    msgDuplicateValue: string;
    msgNotEnoughValues: string;

    constructor(private formBuilder: FormBuilder, private messageServices: MessageServices) {
        this.messageServices.getMessage(Constants.MESSAGE_DUPLICATE_VALUE, (resultMessage: string) => { this.msgDuplicateValue = resultMessage });
        this.messageServices.getMessage(Constants.MESSAGE_AT_LEAST_TWO_VALUES_REQUIRED, (resultMessage: string) => { this.msgNotEnoughValues = resultMessage });
    }

    ngOnInit() {
        this.listConstraintsForm = this.formBuilder.group({
            valuesList: new FormControl({ value: this.arrayToDelimiterSeparated(this.constraints.listOfValues), disabled: this.isDisabled }, Validators.compose([Validators.maxLength(500)])),
        }, { validator: this.listValuesValidator });
    }

    isValid(): boolean {
        if (this.listConstraintsForm.status == 'DISABLED') {
            return true;
        }
        markAllFormControlsAsTouched(this.listConstraintsForm);
        this.listConstraintsForm.markAsTouched();
        this.listConstraintsForm.updateValueAndValidity(); //trigger validators
        return this.listConstraintsForm.valid;
    }

    arrayToDelimiterSeparated(arr: Array<string>): string {
        if (!arr) {
            return '';
        }
        return arr.join(LIST_VALUES_DELIMITER);
    }

    delimiterSeparatedToArray(str: string) {
        this.constraints.listOfValues = str ? str.split(LIST_VALUES_DELIMITER) : [];
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.listConstraintsForm) {
            if (changes['isDisabled'] && changes['isDisabled'].previousValue != changes['isDisabled'].currentValue) {
                const currentIsDisabled: boolean = changes['isDisabled'].currentValue;
                const formControl: FormControl = <FormControl>this.listConstraintsForm.controls['valuesList'];
                currentIsDisabled ? formControl.disable() : formControl.enable();
            }

            if (changes['constraints']) {
                this.listConstraintsForm.reset({ valuesList: this.arrayToDelimiterSeparated(this.constraints.listOfValues) });
            }
        }
    }

    listValuesValidator(group: FormGroup): any {
        if (!group.controls) {
            return null;
        }

        let valuesListFormControl: AbstractControl = group.controls['valuesList'];

        if (valuesListFormControl.pristine && !valuesListFormControl.touched) {
            return null;
        }

        let arrayOfValues: Array<string> = valuesListFormControl.value.split(LIST_VALUES_DELIMITER);

        if (!arrayOfValues || arrayOfValues.length < 2) {
            return { ERROR_NOT_ENOUGH_VALUES };
        }

        let valuesSet: Set<string> = new Set<string>();

        for (let i = 0; i < arrayOfValues.length; i++) {
            if (valuesSet.has(arrayOfValues[i])) {
                return { ERROR_DUPLICATION };
            }
            valuesSet.add(arrayOfValues[i]);
        }
    }
}