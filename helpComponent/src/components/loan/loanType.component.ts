import { Component, Input, ViewChildren, QueryList } from '@angular/core';
import { LoanTypeInterface, LoanTypeMetaDataInterface } from '../interfaces/loan.interface';
import { PageResolver } from '../../utils/page.resolver';
import { ButtonsInterface } from '../interfaces/uiElements/buttons.interface';
import { NavController } from 'ionic-angular';
import { DynamicFieldsValuesInterface, FieldMetadataValueInterface, FieldTypeEnum } from '../interfaces/fieldMetadata.interface';
import { RepresentationComponent } from '../dynamicFields/representation/representation.component';

@Component({
    selector: 'loanType',
    templateUrl: 'loanType.component.html',
    styles: [
        `.ui.huge.message.noshadow {margin: 0; min-height: 100%; box-shadow: none;}`,
        `.field-content {line-height: 98%;}`
    ]
})
export class LoanType {
    @Input() loanType: LoanTypeInterface;
    @Input() buttons?: ButtonsInterface;
    @Input() dynamicFieldsWithValues?: FieldMetadataValueInterface; //if true  - will show the values of dynamic fields, otherwise lets to fill the values of dynamic fields
    @ViewChildren("field") dynamicFieldsQueryList: QueryList<RepresentationComponent>;

    FieldTypeEnum = FieldTypeEnum; //required in order to use it in the html template

    isMobile: boolean;

    requestSubmitted: boolean = false;

    constructor(pageResolver: PageResolver, private nav: NavController) {
        this.isMobile = pageResolver.isMobile();
    }

    popView = (): void => {
        this.nav.pop();
    }

    getDynamicFieldsValues(): DynamicFieldsValuesInterface {
        let dynamicFieldsValues: DynamicFieldsValuesInterface = <DynamicFieldsValuesInterface>{};
        dynamicFieldsValues.dynamicFields = {};

        this.dynamicFieldsQueryList.forEach(element => {
            dynamicFieldsValues.dynamicFields[element.fieldMetadata.name] = element.getData();
        });

        return dynamicFieldsValues;
    }
}