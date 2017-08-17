import { Component, AfterViewInit, Input, ElementRef, ViewChild } from '@angular/core';
import { RepresentationComponent } from './representation.component';
import { FieldMetadataValueInterface } from '../../interfaces/fieldMetadata.interface';
//import { MessageServices } from '../../../services/message.services';
import { Constants } from '../../../utils/constans';
import { isNullOrUndefined } from '../../../utils/utils';

declare var $: any;

@Component({
    selector: 'listRepresentation',
    template:
    `
    <select [id]="fieldMetadata.name" #valuesCombo class="ui mini dropdown fluid" [(ngModel)]="value">
            <option value="">Select value</option>
            <option *ngFor="let val of fieldMetadata?.constraints?.listOfValues" [value]="val">{{val}}</option>
    </select>
    `
})
export class ListRepresentation implements RepresentationComponent, AfterViewInit {
    @Input('fieldMetadata') fieldMetadata: FieldMetadataValueInterface;
    @ViewChild('valuesCombo') valuesComboElementRef: ElementRef;

    value: string;

    // constructor(/*private formBuilder: FormBuilder,*/ private messageServices: MessageServices) {
    //     //this.messageServices.getMessage(Constants.MESSAGE_FROM_LESS_THAN_TO, (resultMessage: string) => { this.errorMessage = resultMessage });
    // }

    ngAfterViewInit() {
        if (isNullOrUndefined(this.fieldMetadata.value)) {
            $(this.valuesComboElementRef.nativeElement).dropdown();
        }
        else {
            this.value = '' + this.fieldMetadata.value;
            $(this.valuesComboElementRef.nativeElement).dropdown('set selected', this.value);
        }
    }

    isValid(): boolean {
        return (!this.fieldMetadata.isMandatory || (this.fieldMetadata.isMandatory && !isNullOrUndefined(this.value)));
    }

    getData(): string {
        return this.value;
    }
}