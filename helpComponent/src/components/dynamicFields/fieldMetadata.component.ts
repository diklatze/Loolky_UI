import { Component, Input, AfterViewInit, ElementRef, ViewChild, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { FieldMetadataInterface, FieldTypeEnum, getFieldTypeDescription } from '../interfaces/fieldMetadata.interface';
import { filterDigitsOnly } from '../../utils/utils';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MessageServices } from '../../services/message.services';
import { CustomValidators } from '../../utils/customValidators';
import { Constants } from '../../utils/constans';
import { markAllFormControlsAsTouched } from '../../utils/utils';
import { ConstraintsComponent } from '../dynamicFields/constraints/constraints.component';

declare var $: any;

@Component({
    selector: 'fieldMetaData',
    styles: [
        `.ui.form .field.no-margin{margin-bottom: 0; margin-top: 0;}`
    ],
    templateUrl: 'fieldMetadata.component.html'
})

export class FieldMetadata implements AfterViewInit, OnChanges, OnInit {
    @Input() showHeaders?: boolean;
    @Input() fieldMetadata: FieldMetadataInterface;
    @Input() predefinedFields: FieldMetadataInterface[];
    @Input() readOnlyMode?: boolean;
    @ViewChild('constraints') constraintsComponent: ConstraintsComponent;
    @ViewChild('fieldTypeCombo') fieldTypeComboElementRef: ElementRef;
    @ViewChild('fieldNameCombo') fieldNameComboElementRef: ElementRef;

    FieldTypeEnum = FieldTypeEnum; //required in order to use it in the html template
    filterDigitsOnly: Function = filterDigitsOnly; //required in order to use it in html template
    getFieldTypeDescription: Function = getFieldTypeDescription; //required in order to use it in html template
    fieldMetadataForm: FormGroup;

    validationErrorMessage: string;

    constructor(private formBuilder: FormBuilder, private messageServices: MessageServices) {
        this.messageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.validationErrorMessage = resultMessage });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['fieldMetadata'] && changes['fieldMetadata'].currentValue && !changes['fieldMetadata'].currentValue.constraints) {
            changes['fieldMetadata'].currentValue.constraints = {};

            if (changes['fieldMetadata'].currentValue.isMandatory == undefined) {
                changes['fieldMetadata'].currentValue.isMandatory = false;
            }
        }

        // if (changes['readOnlyMode']){
        //     this.disableOrEnableAllFormControls(changes['readOnlyMode'].currentValue);
        // }
    }

    isValid() {
        markAllFormControlsAsTouched(this.fieldMetadataForm);
        let constraintsComponentValid: boolean = true;
        if (this.constraintsComponent) {
            constraintsComponentValid = this.constraintsComponent.isValid();
        }
        return this.fieldMetadataForm.valid && constraintsComponentValid;
    }

    ngOnInit() {
        this.fieldMetadataForm = this.formBuilder.group({
            name: new FormControl({ value: this.fieldMetadata.name, disabled: this.readOnlyMode }, Validators.compose([Validators.required])),
            type: new FormControl({ value: this.fieldMetadata.type, disabled: this.fieldMetadata.isPredefined || this.readOnlyMode }, Validators.compose([Validators.required])),
            description: new FormControl({ value: this.fieldMetadata.description, disabled: this.fieldMetadata.isPredefined || this.readOnlyMode }, Validators.compose([Validators.required])),
            isMandatory: new FormControl({ value: this.fieldMetadata.isMandatory == true, disabled: this.readOnlyMode }, Validators.compose([Validators.required])),
            maxLength: new FormControl({ value: this.fieldMetadata.maxLength, disabled: this.fieldMetadata.isPredefined || this.readOnlyMode }, Validators.compose([CustomValidators.emptyOrPositiveIntegerValidator])),
        });
    }

    ngAfterViewInit() {
        $(this.fieldTypeComboElementRef.nativeElement).dropdown({
            onChange: (value, text, $choice) => {
                if (!this.fieldMetadata.isPredefined) {
                    this.fieldMetadata.constraints = {}; //clear constraint value on type combo selection if not a predefined field
                }
            }
        });

        $(this.fieldNameComboElementRef.nativeElement).dropdown({
            allowAdditions: true,
            hideAdditions: false,
            //forceSelection: false,
            onChange: (value, text, $choice) => {
                let isFoundInListOfPredefinedFields: boolean = false;
                const isPreviousFieldWasPredefined: boolean = this.fieldMetadata.isPredefined;

                if (this.predefinedFields) {
                    for (let i = 0; i < this.predefinedFields.length; i++) {
                        if (this.predefinedFields[i].name == value) {
                            this.cloneMetadataAndResetForm(this.predefinedFields[i]);
                            isFoundInListOfPredefinedFields = true;
                            this.refreshElementsAccordingToPredefined();
                            break;
                        }
                    }
                }

                if (!isFoundInListOfPredefinedFields && isPreviousFieldWasPredefined) {
                    // let newMetadata: FieldMetadataInterface = <FieldMetadataInterface>{ name: text, description: null, maxLength: null, type: null, isPredefined: false, isMandatory: false, constraints: {}, index: null };
                    // this.cloneMetadataAndResetForm(newMetadata);
                    this.fieldMetadata.isPredefined = false;
                    this.refreshElementsAccordingToPredefined();
                }
            }
        });

        if (this.fieldMetadata.name) {
            setTimeout(() => {
                $(this.fieldNameComboElementRef.nativeElement).dropdown('set text', this.fieldMetadata.name);
            });
        }

        //TODO: Find a flexible way to change choose the 'mapping' value and not by "set text" command
        if (this.fieldMetadata.type == FieldTypeEnum.mapping) {
            let typeComboElement: any = $(this.fieldTypeComboElementRef.nativeElement);
            typeComboElement.dropdown('set text', this.getFieldTypeDescription(FieldTypeEnum.mapping)).addClass("disabled");
        }

    }

    cloneMetadataAndResetForm = (newMetadata: FieldMetadataInterface): void => {
        Object.assign(this.fieldMetadata, newMetadata); //this will copy properties
        this.fieldMetadataForm.reset({ name: this.fieldMetadata.name, type: this.fieldMetadata.type, isMandatory: this.fieldMetadata.isMandatory == true, description: this.fieldMetadata.description, maxLength: this.fieldMetadata.maxLength });
    }

    refreshElementsAccordingToPredefined = (): void => {
        let typeComboElement: any = $(this.fieldTypeComboElementRef.nativeElement);
        const command: string = (this.fieldMetadata.type === null || this.fieldMetadata.type === undefined) ? "clear" : "set selected";

        if (this.fieldMetadata.isPredefined) {
            //TODO: Find a flexible way to change choose the 'mapping' value and not by "set text" command
            if (this.fieldMetadata.type == FieldTypeEnum.mapping) {
                typeComboElement.dropdown('set text', this.getFieldTypeDescription(FieldTypeEnum.mapping)).addClass("disabled");
            }
            else {
                typeComboElement.dropdown(command, this.fieldMetadata.type).addClass("disabled");
            }

        }
        else {
            typeComboElement.dropdown(command, this.fieldMetadata.type).removeClass("disabled");
        }
        this.disableOrEnableAllFormControls(this.fieldMetadata.isPredefined);
    }

    disableOrEnableAllFormControls(isDisable: boolean) {
        if (!this.fieldMetadataForm) {
            return;
        }

        for (let name in this.fieldMetadataForm.controls) {
            if (name == 'isMandatory' && !this.readOnlyMode) { //skip 'isMandatory'
                continue;
            }
            let formControl: AbstractControl = this.fieldMetadataForm.controls[name];
            isDisable ? formControl.disable() : formControl.enable();
        }
    }

    isInvalidField(fieldName: string): boolean {
        let fieldControl = this.fieldMetadataForm.controls[fieldName];
        return (fieldControl.touched && fieldControl.invalid);
    }
}