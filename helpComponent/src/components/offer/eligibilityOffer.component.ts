import { FormComponent } from './formComponent.component';
import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from '../../utils/customValidators';
import { EligibilityOfferInterface } from '../interfaces/offer.interface';
import { MessageServices } from '../../services/message.services';
import { Constants } from '../../utils/constans';
import { UtilsServices } from '../../services/utils.services';
import { markAllFormControlsAsTouched } from '../../utils/utils';
import { OfferType } from '../interfaces/offer.interface';

declare var $: any;

@Component({
    selector: 'eligibilityOffer',
    template:
    //TODO: On development of this component separate the template from ts file
    `<div [hidden]="isSummaryMode" class="ui error small form segment">
        <form [formGroup]="eligibilityScholarshipForm" class="ui medium form" #f="ngForm">
            <!-- <div class="field required four wide">
                <label>Studies type</label>
                <select class="ui fluid dropdown form-control" id="studiesTypeCombo" [(ngModel)]="eligibilityScholarship.studiesType" formControlName="studiesType">
                    <option value="">Studies type</option>
                    <option value="BA">BA</option>
                    <option value="BSC">BSC</option>
                    <option value="MA">MA</option>
                </select>
                <div *ngIf="isInvalid('studiesType')" class="ui red pointing above ui label">{{validationErrorMessage}} studies type</div>
            </div>
            -->
        </form>
    </div>

    <div [hidden]="!isSummaryMode" class="accordion-wrapper">
        <accordion [title]="accordionTitle" [id]="'eligibilityScholarshipAccordion'">
       <!--
           <!-- <div class="ui tiny list">
                <div id="studiesTypeSummaryModeTxt" class="item"><b>Studies type: </b>{{eligibilityScholarship?.studiesType}}</div>
            </div>
        -->
        </accordion>
    </div>
    `,
})
export class EligibilityOffer implements FormComponent, OnInit, OnChanges {
    @Input() isSummaryMode: boolean;
    @Input() offerType: OfferType;

    eligibilityScholarshipForm: FormGroup;
    eligibilityScholarship: EligibilityOfferInterface = <EligibilityOfferInterface>{};

    readOnlyMode: boolean = false;

    messages = null;
    validationErrorMessage: string;

    accordionTitle: string = "Eligibility";

    setData(eligibilityScholarship: EligibilityOfferInterface, isReadOnlyMode: boolean) {
        this.readOnlyMode = isReadOnlyMode;
        this.eligibilityScholarship = eligibilityScholarship;

        this.eligibilityScholarshipForm.disable();
    }

    isValid = (): boolean => {
        return true;
        // if (this.eligibilityScholarshipForm.valid) {
        //     return true;
        // }

        // markAllFormControlsAsTouched(this.eligibilityScholarshipForm);
        // return false;
    }

    isDirty = (): boolean => {
        return false;
        // if (this.readOnlyMode) {
        //     return false;
        // }
        // return this.eligibilityScholarshipForm.dirty;
    }

    getFormData = (): EligibilityOfferInterface => {
        return this.eligibilityScholarship;
    }

    clearFormData = (): void => {
        this.eligibilityScholarshipForm.reset();
        $('#studiesTypeCombo').dropdown('clear');
    }

    constructor(private formBuilder: FormBuilder, private messageServices: MessageServices) {
        this.messageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.validationErrorMessage = resultMessage });
    }

    ngOnInit() {
        this.eligibilityScholarshipForm = this.formBuilder.group({
            'studiesType': new FormControl({}, Validators.compose([Validators.required, Validators.maxLength(50), CustomValidators.notEmptyString])),
        })
    }

    isInvalid(fieldName: string): boolean {
        return (this.eligibilityScholarshipForm.controls[fieldName].touched && !this.eligibilityScholarshipForm.controls[fieldName].valid);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isSummaryMode'] && changes['isSummaryMode'].currentValue == false) {
            setTimeout(() => { $('#studiesTypeCombo').dropdown(); });
        }
    }

}