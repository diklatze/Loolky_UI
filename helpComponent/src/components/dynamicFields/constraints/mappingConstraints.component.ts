import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConstraintsComponent } from './constraints.component';
import { MappingConstraintsInterface } from '../../interfaces/fieldMetadata.interface';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageServices } from '../../../services/message.services';
import { markAllFormControlsAsTouched } from '../../../utils/utils';
import { Constants } from '../../../utils/constans';

@Component({
    selector: 'mappingConstraints',
    template:
    `
    <form [formGroup]="mappingConstraintsForm" class="ui tiny form">
        <div class="ui equal width grid">
            <div class="field inline column" style="margin-bottom: 0">
                <label>Contract</label>
                <input type="text" name="contractName" maxlength="30" placeholder="contractName" [(ngModel)]="constraints.contractName" style="width: 70%"
                    class="form-control ui input" formControlName="contractName">
            </div>
            
            <div class="field inline column" style="margin-bottom: 0">
                <label>Field</label>        
                <input type="text" name="contractField" maxlength="30" placeholder="contractField" [(ngModel)]="constraints.contractField" style="width: 70%"
                    class="form-control ui input" formControlName="contractField">
            </div>

            <div *ngIf="mappingConstraintsForm.invalid && mappingConstraintsForm.controls['contractName'].valid && mappingConstraintsForm.controls['contractField'].valid" 
                  class="ui tiny red pointing above label centered row" style="margin-top: 0">{{errorMessage}}</div>
        </div>                  
    </form>
    `
})
export class MappingConstraints implements ConstraintsComponent, OnInit, OnChanges {
    @Input('constraints') constraints: MappingConstraintsInterface;
    @Input('isDisabled') isDisabled: boolean;

    mappingConstraintsForm: FormGroup;

    errorMessage: string;

    constructor(private formBuilder: FormBuilder, private messageServices: MessageServices) { 
        this.messageServices.getMessage(Constants.MESSAGE_DYNAMIC_FIELDS_NOT_DEFINED, (resultMessage: string) => { this.errorMessage = resultMessage });
    }

    ngOnInit() {
        this.mappingConstraintsForm = this.formBuilder.group({
            contractName: new FormControl({ value: this.constraints.contractName, disabled: this.isDisabled }, Validators.compose([Validators.maxLength(30)])),
            contractField: new FormControl({ value: this.constraints.contractField, disabled: this.isDisabled }, Validators.compose([Validators.maxLength(30)])),
        }, { validator: MappingConstraints.fromToValidator });
    }

    isValid(): boolean {
        if (this.mappingConstraintsForm.status == 'DISABLED'){
            return true;
        }
        markAllFormControlsAsTouched(this.mappingConstraintsForm);
        return this.mappingConstraintsForm.valid;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.mappingConstraintsForm) {
            if (changes['isDisabled'] && changes['isDisabled'].previousValue != changes['isDisabled'].currentValue) {
                const currentIsDisabled: boolean = changes['isDisabled'].currentValue;
                for (let fieldName in this.mappingConstraintsForm.controls) {
                    const formControl: FormControl = <FormControl>this.mappingConstraintsForm.controls[fieldName];
                    currentIsDisabled ? formControl.disable() : formControl.enable();
                }
            }

            if (changes['constraints']) {
                this.mappingConstraintsForm.reset({ contractName: this.constraints.contractName, contractField: this.constraints.contractField });
            }
        }
    }

    static fromToValidator(group: FormGroup): any {
        let contractName = group.controls['contractName'];
        let contractField = group.controls['contractField'];

        if (contractName.pristine && contractField.pristine) {
            return null;
        }
    }
}