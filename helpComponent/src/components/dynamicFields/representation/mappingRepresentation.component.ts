import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RepresentationComponent } from './representation.component';
import { FieldMetadataInterface } from '../../interfaces/fieldMetadata.interface';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageServices } from '../../../services/message.services';
import { markAllFormControlsAsTouched } from '../../../utils/utils';

@Component({
    selector: 'mappingRepresentation',
    template:
    `
        <form [formGroup]="mappingRepresentationForm" class="ui tiny form">
            <input type="text" [id]="fieldMetadata.name" [placeholder]="fieldMetadata.name" [(ngModel)]="value"
                    class="form-control ui input" formControlName="value">
        </form>
    `
})
export class MappingRepresentation implements RepresentationComponent, OnInit, OnChanges {
    @Input('fieldMetadata') fieldMetadata: FieldMetadataInterface;

    mappingRepresentationForm: FormGroup;
    value: string;

    constructor(private formBuilder: FormBuilder, private messageServices: MessageServices) { 
    }

    ngOnInit() {
        this.mappingRepresentationForm = this.formBuilder.group({
            value: new FormControl({ }, Validators.compose([/*Validators.maxLength(30)*/])),
        }, { /*validator: MappingConstraints.fromToValidator*/ });
    }

    isValid(): boolean {
        markAllFormControlsAsTouched(this.mappingRepresentationForm);
        return this.mappingRepresentationForm.valid;
    }

    getData(): string{
        return this.value;
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    static fromToValidator(group: FormGroup): any {

    }
}