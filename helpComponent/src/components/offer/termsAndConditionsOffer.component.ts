import { FormComponent } from './formComponent.component';
import { Component, Input, ViewChildren, QueryList, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from '../../utils/customValidators';
import { RequiredInfoOfferInterface } from '../interfaces/offer.interface';
import { DateConstraintsInterface } from '../interfaces/fieldMetadata.interface';
import { MessageServices } from '../../services/message.services';
import { MemberServices } from '../../services/member.services';
import { PageService } from '../pageHeader/page.service';
import { Constants } from '../../utils/constans';
import { UtilsServices } from '../../services/utils.services';
import { markAllFormControlsAsTouched, toDate } from '../../utils/utils';
import { FieldMetadataInterface, FieldMetadataValueInterface,  FieldTypeEnum, getFieldTypeDescription, LIST_VALUES_DELIMITER } from '../interfaces/fieldMetadata.interface';
import { FieldMetadata } from '../dynamicFields/fieldMetadata.component';
import { OfferType } from '../interfaces/offer.interface';

declare var $: any;

@Component({
    selector: 'requiredInfoOffer',
    templateUrl: 'termsAndConditionsOffer.component.html'
})
export class TermsAndConditionsOffer implements FormComponent, OnInit {
    @Input() isSummaryMode: boolean;
    @Input() offerType: OfferType;
    @ViewChildren("fieldMetadata") fieldMetadataQueryList: QueryList<FieldMetadata>;

    getFieldTypeDescription: Function = getFieldTypeDescription; //required in order to use it in html template

    requiredInfoOffer: RequiredInfoOfferInterface = <RequiredInfoOfferInterface>{};
    predefinedFields: FieldMetadataInterface[] = [];

    FieldTypeEnum = FieldTypeEnum; //required in order to use it in the html template

    messages = null;
    validationErrorMessage: string;

    messageNoDynamicFieldsYet: string;

    accordionTitle: string = "Required Info";

    readOnlyMode: boolean = false;
    editMode: boolean = false;
    origRequiredInfoOfferStringified: string = null;

    LIST_DELIMITER: string = LIST_VALUES_DELIMITER;

    deleteRow(index: number) {
        this.requiredInfoOffer.dynamicFields.splice(index, 1);
    }

    setData(requiredInfoOffer: RequiredInfoOfferInterface, isReadOnlyMode: boolean) {
        this.editMode = true;
        this.readOnlyMode = isReadOnlyMode;

        if (requiredInfoOffer.dynamicFields) {
            for (let i = 0; i < requiredInfoOffer.dynamicFields.length; i++) {
                //TODO: remove this workaround once removing the 'type' field from FieldMetadataInterface
                requiredInfoOffer.dynamicFields[i].type = requiredInfoOffer.dynamicFields[i].constraints.type;
                if (requiredInfoOffer.dynamicFields[i].type == FieldTypeEnum.date) {
                    let dateConstraints: DateConstraintsInterface = <DateConstraintsInterface>requiredInfoOffer.dynamicFields[i].constraints;
                    dateConstraints.minDate = toDate(dateConstraints.minDate);
                    dateConstraints.maxDate = toDate(dateConstraints.maxDate);
                }
            }
        }

        //save a copy os stringified requiredInfoOffer, this is required in order to check if the object is dirty
        this.origRequiredInfoOfferStringified = JSON.stringify(requiredInfoOffer);

        this.requiredInfoOffer = requiredInfoOffer;
    }

    swapRows(index1, index2: number) {
        let temp = this.requiredInfoOffer.dynamicFields[index1];
        this.requiredInfoOffer.dynamicFields[index1] = this.requiredInfoOffer.dynamicFields[index2];
        this.requiredInfoOffer.dynamicFields[index2] = temp;
    }

    appendRow(index?: number) {
        if (index === undefined) {
            index = this.requiredInfoOffer.dynamicFields.length - 1;
        }
        this.requiredInfoOffer.dynamicFields.splice(index + 1, 0, <FieldMetadataValueInterface>{});
    }

    isValid = (): boolean => {
        var isValid: boolean = true;
        if (this.fieldMetadataQueryList) {
            this.fieldMetadataQueryList.forEach(fieldMetadataElement => {
                isValid = fieldMetadataElement.isValid();
            });
        }
        return isValid;
    }

    isDirty = (): boolean => {
        if (this.readOnlyMode) {
            return false;
        }

        if (this.editMode) {
            return this.origRequiredInfoOfferStringified != JSON.stringify(this.requiredInfoOffer);
        }

        return (this.requiredInfoOffer.dynamicFields && this.requiredInfoOffer.dynamicFields.length > 0);
    }

    getFormData = (): RequiredInfoOfferInterface => {
        let dynamicFields: FieldMetadataInterface[] = this.requiredInfoOffer.dynamicFields;
        if (dynamicFields) {
            for (let i = 0; i < dynamicFields.length; i++) {
                dynamicFields[i].index = i;
                dynamicFields[i].constraints.type = dynamicFields[i].type; //TODO: remove this workaround once removing the 'type' field from FieldMetadataInterface
            }
        }
        return this.requiredInfoOffer;
    }

    clearFormData = (): void => {
        this.requiredInfoOffer.dynamicFields = [];
    }

    constructor(private formBuilder: FormBuilder, private messageServices: MessageServices, private memberServices: MemberServices, private pageService: PageService) {
        this.requiredInfoOffer.dynamicFields = [];
        this.messageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.validationErrorMessage = resultMessage });
        this.messageServices.getMessage(Constants.MESSAGE_DYNAMIC_FIELDS_NOT_DEFINED, (resultMessage: string) => { this.messageNoDynamicFieldsYet = resultMessage });
    }

    ngOnInit() {
        this.memberServices.getPredefinedDynamicFields(this.pageService.getMember().shortName, this.offerType).subscribe(
            res => {
                this.predefinedFields = res.predefinedFields;
                //TODO: remove this workaround once removing the 'type' field from FieldMetadataInterface
                if (this.predefinedFields) {
                    for (let i = 0; i < this.predefinedFields.length; i++) {
                        if (this.predefinedFields[i].constraints && this.predefinedFields[i].constraints.type) {
                            this.predefinedFields[i].type = this.predefinedFields[i].constraints.type;
                            //Convert minDate and maxDate to Date objects
                            if (this.predefinedFields[i].constraints.type == FieldTypeEnum.date) {
                                let dateConstraints: DateConstraintsInterface = <DateConstraintsInterface>this.predefinedFields[i].constraints;
                                dateConstraints.minDate = toDate(dateConstraints.minDate);
                                dateConstraints.maxDate = toDate(dateConstraints.maxDate);
                            }
                        }
                    }
                }
            },
            err => {
                console.error('Terms and conditions: Error occured on getPredefinedDynamicFields');
                console.error(err);
            });
    }
}