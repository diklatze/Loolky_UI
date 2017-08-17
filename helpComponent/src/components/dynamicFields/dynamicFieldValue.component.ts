import { Component, Input } from '@angular/core';
import { FieldMetadataValueInterface } from '../interfaces/fieldMetadata.interface';
import { FieldTypeEnum } from '../interfaces/fieldMetadata.interface';

@Component({
    selector: 'dynamicFieldValue',
    template:
    `
        <ng-container [ngSwitch]="dynamicField?.constraints?.type">
            <ng-container *ngSwitchCase="FieldTypeEnum.numeric">{{dynamicField.value? (dynamicField.value | number) : ''}}</ng-container>
            <ng-container *ngSwitchCase="FieldTypeEnum.date">{{dynamicField.value? (dynamicField.value | date:'shortDate') : ''}}</ng-container>
            <ng-container *ngSwitchDefault>{{dynamicField.value}}</ng-container>
        </ng-container>
    `
})

export class DynamicFieldValue {
    @Input() dynamicField: FieldMetadataValueInterface; 
    FieldTypeEnum = FieldTypeEnum; //required in order to use it in the html template
    
    constructor() { }
}