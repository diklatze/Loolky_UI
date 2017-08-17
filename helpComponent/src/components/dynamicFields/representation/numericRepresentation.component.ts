import { Component, Input, AfterViewInit } from '@angular/core';
import { RepresentationComponent } from './representation.component';
import { FieldMetadataValueInterface } from '../../interfaces/fieldMetadata.interface';
import { filterDigitsOnly, isNullOrUndefined, isNumber } from '../../../utils/utils';
//import { MessageServices } from '../../../services/message.services';
//import { Constants } from '../../../utils/constans';

@Component({
    selector: 'numericRepresentation',
    template:
    `
    <input type="text" [id]="fieldMetadata.name" (keypress)="filterDigitsOnly($event)" [placeholder]="fieldMetadata.name" 
        [(ngModel)]="value" class="ui input">
    `
})
export class NumericRepresentation implements RepresentationComponent, AfterViewInit {
    @Input('fieldMetadata') fieldMetadata: FieldMetadataValueInterface;

    filterDigitsOnly: Function = filterDigitsOnly; //required in order to use it in html template

    value: number;

    // constructor(private messageServices: MessageServices) { 
    //     //this.messageServices.getMessage(Constants.MESSAGE_FROM_LESS_THAN_TO, (resultMessage: string) => { this.errorMessage = resultMessage });
    // }

    ngAfterViewInit() {
        if (isNumber(this.fieldMetadata.value)) {
            this.value = +this.fieldMetadata.value;
        }
    }

    isValid(): boolean {
        return (!this.fieldMetadata.isMandatory || (this.fieldMetadata.isMandatory && !isNullOrUndefined(this.value)));
    }

    getData(): number {
        return this.value;
    }
}