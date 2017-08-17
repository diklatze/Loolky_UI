import { Component, Input } from '@angular/core';
import { ScholarshipInterface } from '../interfaces/scholarship.interface';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { ViewedTypeEnum, StripModeEnum } from '../interfaces/types.interface';
import { StudentServices } from '../../services/student.services';
import { getInnerObjectProperty } from '../../utils/utils';
import { OfferType } from '../interfaces/offer.interface';

@Component({
    selector: 'scholarshipStrip',
    templateUrl: 'scholarshipStrip.component.html',
    providers: [StudentServices],
    styles: [`.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td.padding-right {padding: 0px 5px 0px 0px;}`]
})

export class ScholarshipStrip {
    @Input() scholarshipData: ScholarshipInterface;
    @Input() delegateFunction: Function;
    @Input() fields: FieldInterface[];
    @Input() position: string;
    @Input() userId: string;
    @Input() afterActionFunction: (ScholarshipInterface) => void;
    @Input() dateSentence: string;
    @Input() scholarshipStripMode: StripModeEnum;
    @Input() hideheart: boolean;

    ScholarshipStripMode = StripModeEnum; //required in order to use it in the html template

    viewedType = ViewedTypeEnum; //required in order to use it in the html template

    constructor(private studentServices: StudentServices) {
    }

    onSaveOrUnsave(event: any, isUnsave: boolean): void {
        this.studentServices.saveUnsaveOffer(this.userId, this.scholarshipData.organization, this.scholarshipData.info.name, isUnsave, OfferType.scholarship).subscribe(
            res => {
                if (res.code != 0) {
                    console.error("Cannot " + (isUnsave ? "unsave" : "save") + " scholarship [code: " + res.code + "]");
                }
            },
            err => {
                console.error("Cannot " + (isUnsave ? "unsave" : "save") + " scholarship [err: " + err + "]");
            }
        )
        this.scholarshipData.saved = !isUnsave;
        event.stopPropagation();
        if (this.afterActionFunction) {
            this.afterActionFunction(this.scholarshipData);
        }
    }

    getFieldContent(scholarshipField: FieldInterface): string {
        return getInnerObjectProperty(this.scholarshipData, scholarshipField.name, scholarshipField.formatter);
    }
}
