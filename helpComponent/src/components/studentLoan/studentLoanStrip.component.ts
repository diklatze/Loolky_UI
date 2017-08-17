import { Component, Input } from '@angular/core';
import { StudentLoanInterface } from '../interfaces/loan.interface';
import { PageService } from '../pageHeader/page.service';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { ViewedTypeEnum } from '../interfaces/types.interface';
import { getInnerObjectProperty } from '../../utils/utils';
import { UserType } from '../../utils/constans';
import { OfferTransactionState } from '../interfaces/offer.interface';

@Component({
    selector: 'studentLoanStrip',
    templateUrl: 'studentLoanStrip.component.html',
    styles: [
        `.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td .padding-right {padding: 0px 5px 0px 0px;}`,
        `.transaction-failed {background-color: red;}`
    ]
})

export class StudentLoanStrip {
    @Input() studentLoanData: StudentLoanInterface;
    @Input() delegateFunction: Function;
    @Input() fields: FieldInterface[];
    @Input() position: string;
    @Input() dateSentence: string;

    viewedType = ViewedTypeEnum; //required in order to use it in the html template
    OfferTransactionState = OfferTransactionState; //required in order to use it in the html template
    UserType = UserType;  //required in order to use it in the html template
    userType: string;

    constructor(private pageService: PageService) {
        this.userType = pageService.getUsertype();
    }

    getFieldContent(loanField: FieldInterface): string {
        return getInnerObjectProperty(this.studentLoanData, loanField.name, loanField.formatter);
    }
}