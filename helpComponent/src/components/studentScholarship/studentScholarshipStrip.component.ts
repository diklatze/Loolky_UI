import { Component, Input } from '@angular/core';
import { StudentScholarshipInterface } from '../interfaces/scholarship.interface';
import { ViewedTypeEnum } from '../interfaces/types.interface';
import { PageService } from '../pageHeader/page.service';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { UserType } from '../../utils/constans';
import { getInnerObjectProperty } from '../../utils/utils';
import { OfferTransactionState } from '../interfaces/offer.interface';

@Component({
    selector: 'studentScholarshipStrip',
    templateUrl: 'studentScholarshipStrip.component.html',
    styles: [
        `.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td .padding-right {padding: 0px 5px 0px 0px;}`,
        `.transaction-failed {background-color: red;}`
    ]
})

export class StudentScholarshipStrip {
    @Input() studentScholarshipData: StudentScholarshipInterface;
    @Input() delegateFunction: Function;
    @Input() fields: FieldInterface[];
    @Input() position: string;
    @Input() dateSentence: string;

    OfferTransactionState = OfferTransactionState; //required in order to use it in the html template
    viewedType = ViewedTypeEnum; //required in order to use it in the html template
    UserType = UserType;  //required in order to use it in the html template

    userType: string;

    constructor(private pageService: PageService) {
        this.userType = pageService.getUsertype();
    }

    getFieldContent(scholarshipField: FieldInterface): string {
        return getInnerObjectProperty(this.studentScholarshipData, scholarshipField.name, scholarshipField.formatter);
    }
}