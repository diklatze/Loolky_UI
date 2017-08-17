import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { RepresentationComponent } from './representation.component';
import { FieldMetadataValueInterface } from '../../interfaces/fieldMetadata.interface';
//import { MessageServices } from '../../../services/message.services';
import { Constants } from '../../../utils/constans';
import { isNullOrUndefined } from '../../../utils/utils';

declare var $: any;

@Component({
    selector: 'freetextRepresentation',
    template:
    //maxlength="200"
    `
    <textarea [id]="fieldMetadata.name" rows="1" class="ui input" [placeholder]="fieldMetadata.name" [(ngModel)]="value">
    </textarea>
    `
})
export class FreeTextRepresentation implements RepresentationComponent, OnInit {
    @Input('fieldMetadata') fieldMetadata: FieldMetadataValueInterface;
    value: string;

    // constructor( private messageServices: MessageServices) {
    //     //this.messageServices.getMessage(Constants.MESSAGE_FROM_LESS_THAN_TO, (resultMessage: string) => { this.errorMessage = resultMessage });
    // }

    ngOnInit() {
        if (!isNullOrUndefined(this.fieldMetadata.value)) {
            this.value = '' + this.fieldMetadata.value;
        }
    }

    isValid(): boolean {
        return (!this.fieldMetadata.isMandatory || (this.fieldMetadata.isMandatory && !isNullOrUndefined(this.value)));
    }

    getData(): string {
        return this.value;
    }
}