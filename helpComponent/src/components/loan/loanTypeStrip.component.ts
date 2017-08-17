import { Component, Input } from '@angular/core';
import { LoanTypeInterface } from '../interfaces/loan.interface';
import { StudentServices } from '../../services/student.services';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { ViewedTypeEnum, StripModeEnum } from '../interfaces/types.interface';
import { getInnerObjectProperty } from '../../utils/utils';
import { OfferType } from '../interfaces/offer.interface';

@Component({
    selector: 'loanTypeStrip',
    templateUrl: 'loanTypeStrip.component.html',
    providers: [StudentServices],
    styles: [`.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td.padding-right {padding: 0px 5px 0px 0px;}`]
})

export class LoanTypeStrip {
    @Input() loanTypeData: LoanTypeInterface;
    @Input() delegateFunction: Function;
    @Input() fields: FieldInterface[];
    @Input() position: string;
    @Input() userId: string;
    @Input() afterActionFunction: (LoanTypeInterface) => void;
    @Input() dateSentence: string;
    @Input() loanTypeStripMode: StripModeEnum;
    @Input() hideheart: boolean;

    LoanTypeStripMode = StripModeEnum; //required in order to use it in the html templat

    viewedType = ViewedTypeEnum; //required in order to use it in the html template

    constructor(private studentServices: StudentServices) { }

    onSaveOrUnsave(event: any, isUnsave: boolean): void {
        this.studentServices.saveUnsaveOffer(this.userId, this.loanTypeData.info.govId, this.loanTypeData.info.loanCode, isUnsave, OfferType.loanType).subscribe(
            res => {
                if (res.code != 0) {
                    console.error("Cannot " + (isUnsave ? "unsave" : "save") + " loan type [code: " + res.code + "]");
                }
            },
            err => {
                console.error("Cannot " + (isUnsave ? "unsave" : "save") + " loan type [err: " + err + "]");
            }
        )
        this.loanTypeData.saved = !isUnsave;
        event.stopPropagation();
        if (this.afterActionFunction) {
            this.afterActionFunction(this.loanTypeData);
        }
    }

    getFieldContent(loanField: FieldInterface): string {
        return getInnerObjectProperty(this.loanTypeData, loanField.name, loanField.formatter);
    }
}