import { Component, Input, OnInit } from '@angular/core';
import { JobOfferInterface } from '../interfaces/jobOffer.interface';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { ViewedTypeEnum, StripModeEnum } from '../interfaces/types.interface';
import { StudentServices } from '../../services/student.services';
import { getInnerObjectProperty } from '../../utils/utils';
import { OfferType } from '../interfaces/offer.interface';
import { PageResolver } from '../../utils/page.resolver';

@Component({
    selector: 'jobOfferStrip',
    templateUrl: 'jobOfferStrip.component.html',
    providers: [StudentServices, PageResolver],
    styles: [`.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td.padding-right {padding: 0px 5px 0px 0px;}`,
        `div.text-overflow{word-wrap: break-word; white-space: nowrap; width: 125px; text-overflow: ellipsis; overflow: hidden;}`
    ]
})

export class JobOfferStrip {
    @Input() jobOfferData: JobOfferInterface;
    @Input() delegateFunction: Function;
    @Input() fields: FieldInterface[];
    @Input() position: string;
    @Input() userId: string;
    @Input() afterActionFunction: (JobOfferInterface) => void;
    @Input() dateSentence: string;
    @Input() jobOfferStripMode: StripModeEnum;
    @Input() hideheart: boolean;

    isMobile: boolean;

    JobOfferStripMode = StripModeEnum; //required in order to use it in the html template
    viewedType = ViewedTypeEnum; //required in order to use it in the html template

    constructor(private studentServices: StudentServices, pageResolver: PageResolver) {
        this.isMobile = pageResolver.isMobile();
    }

    onSaveOrUnsave(event: any, isUnsave: boolean): void {
        this.studentServices.saveUnsaveOffer(this.userId, this.jobOfferData.organization, this.jobOfferData.info.name, isUnsave, OfferType.jobOffer).subscribe(
            res => {
                if (res.code != 0) {
                    console.error("Cannot " + (isUnsave ? "unsave" : "save") + " job offer [code: " + res.code + "]");
                }
            },
            err => {
                console.error("Cannot " + (isUnsave ? "unsave" : "save") + " job offer [err: " + err + "]");
            }
        )
        this.jobOfferData.saved = !isUnsave;
        event.stopPropagation();
        if (this.afterActionFunction) {
            this.afterActionFunction(this.jobOfferData);
        }
    }

    getFieldContent(jobOfferField: FieldInterface): string {
        return getInnerObjectProperty(this.jobOfferData, jobOfferField.name, jobOfferField.formatter);
    }

}