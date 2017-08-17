import { Component, OnInit, ViewChild } from '@angular/core';
import { AppliedLoans } from '../../components/studentLoan/appliedLoans.component';
import { AppliedScholarships } from '../../components/studentScholarship/appliedScholarships.component';
import { StudentRegistrationPage } from '../../components/studentRegistration/studentRegistration.component';
import { NavParams, NavController, Tabs } from 'ionic-angular';
import { PageService } from '../pageHeader/page.service';
import { MemberServices } from '../../services/member.services';
import { MessageServices } from '../../services/message.services';
import { StudentServices } from '../../services/student.services';
import { StudentInterface } from '../interfaces/student.interface';
import { MemberInterface } from '../interfaces/member.interface';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { ViewedTypeEnum } from '../interfaces/types.interface';
import { ItemInterface } from '../interfaces/loan.interface';
import { Constants } from '../../utils/constans';

@Component({
    selector: 'studentDetails',
    templateUrl: 'studentDetails.component.html',
    providers: [StudentServices],
    styles: [
        `/deep/ studentDetails ion-content.no-scroller > div.scroll-content{
            overflow-y: hidden;
        }`
    ]
})
export class StudentDetails {

    // this tells the tabs component which Pages should be each tab's root Page
    studentRegistrationInfo: any;
    studentAppliedScholarships: any;
    studentAppliedLoans: any;

    pageTitle: string;

    // Control selected tab
    @ViewChild('studentDetailsTabs') tabRef: Tabs;

    eiName: string;
    member: MemberInterface;

    student: StudentInterface = <StudentInterface>{};
    faculties: ItemInterface;


    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    errMessages: any[] = null;
    draft: boolean = false;

    constructor(private memberServices: MemberServices, private studentServices: StudentServices,
        private navParams: NavParams, private messageServices: MessageServices, private nav: NavController,
        private pageService: PageService) {

        this.student = navParams.get('student');
        
        if(this.student){
            this.draft = this.student.draft;
        }
        
        this.member = this.pageService.getMember();
        this.eiName = this.member.fullName;

        this.pageTitle = this.eiName + " - Student Details";

        this.studentRegistrationInfo = StudentRegistrationPage;
        this.studentAppliedScholarships = AppliedScholarships;
        this.studentAppliedLoans = AppliedLoans;
    }

    getEiId(): string {
        return (this.member ? this.member.shortName : null);
    }

    submit = (): void => {
        this.errMessages = null;
        this.studentServices.updateStudentInfo(this.student).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        //Mark student as submitted
                        this.navParams.get("student").viewed = ViewedTypeEnum.SUBMITTED;
                        this.showModal("Student details successfully updated", this.popBack);
                        break;
                    case 595:
                        this.errMessages = [{ fieldName: "", errorCode: "595", errorDescription: "" }];
                        this.showModal("Student not found in DB", this.popBack);
                        break;
                    case 585:
                        this.errMessages = [{ fieldName: "", errorCode: "585", errorDescription: "" }];
                        this.showModal("Validation Error", this.popBack);
                        break;

                    default:
                        this.errMessages = res.errors;
                }
            })
    }

    saveDraft = (): void => {
        this.errMessages = null;
        this.studentServices.saveStudentInfoDraft(this.student).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        //Mark student as viewed
                        this.navParams.get("student").viewed = ViewedTypeEnum.VIEWED;
                        this.showModal("Student draft successfully saved", this.popBack);
                        break;
                    case 595:
                        this.errMessages = [{ fieldName: "", errorCode: "595", errorDescription: "" }];
                        this.showModal("Student not found in DB", this.popBack);
                        break;
                    case 585:
                        this.errMessages = [{ fieldName: "", errorCode: "585", errorDescription: "" }];
                        this.showModal("Validation Error", this.popBack);
                        break;

                    default:
                        this.errMessages = res.errors;
                }
            })
    }

    rollback = (): void => {
        this.errMessages = null;
        this.studentServices.rollbackStudentInfo(this.student).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        //Mark student as viewed
                        this.navParams.get("student").viewed = ViewedTypeEnum.VIEWED;

                        // Swith current student data with contract data
                        this.student = res.student;
                        this.draft = this.student.draft;
                        
                        this.tabRef.getByIndex(0).getActive().instance.setData(this.student);

                        break;
                    case 595:
                        this.errMessages = [{ fieldName: "", errorCode: "595", errorDescription: "" }];
                        this.showModal("Student not found in DB", this.popBack);
                        break;
                    case 585:
                        this.errMessages = [{ fieldName: "", errorCode: "585", errorDescription: "" }];
                        this.showModal("Validation Error", this.popBack);
                        break;

                    default:
                        this.errMessages = res.errors;
                }
            })
    }

    reactivate = (): void => {
        // Call to backend Rest API and set student status to Active
        this.errMessages = null;
        this.student.status = 'Active';
        this.studentServices.updateStudentInfo(this.student).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        //Mark student as submitted
                        this.navParams.get("student").viewed = ViewedTypeEnum.SUBMITTED;
                        this.showModal("Student successfully activated", this.popBack);
                        break;
                    case 595:
                        this.errMessages = [{ fieldName: "", errorCode: "595", errorDescription: "" }];
                        this.showModal("Student not found in DB", this.popBack);
                        break;
                    case 585:
                        this.errMessages = [{ fieldName: "", errorCode: "585", errorDescription: "" }];
                        this.showModal("Validation Error", this.popBack);
                        break;

                    default:
                        this.errMessages = res.errors;
                }
            })
    }

    showModal(messageId: string, callbackFunction1: Function, callbackFunction2?: Function, messageParameters?: [string]): void {
        this.messageServices.getMessage(messageId, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, messageParameters);
        this.actions = ModalMessage.getModalActionsPattern(callbackFunction1, callbackFunction2); //get actions for modal message screen
        this.messageModalShown = true; //show the modal
    }

    private popBack = (): void => {
        this.messageModalShown = false; //close the modal
        this.nav.pop();
    }

    close = (): void => {
        if (this.isDirty()) {
            this.showModal(Constants.MESSAGE_CLOSE_PAGE, () => { this.messageModalShown = false; }, this.popBack);
        }
        else {
            this.nav.pop();
        }
    }

    //loop on the formComponent and check if dirty
    isDirty = (): boolean => {
        // return this.tabRef.getByIndex(this.tabRef.getIndex(this.tabRef.getSelected())).getActive().instance.isDirty()
        if (this.tabRef.getByIndex(0).getActive()) {
            return this.tabRef.getByIndex(0).getActive().instance.isDirty();
        }
        return false;
    }
    
    reactivateButtonDisabled = (): boolean => {
        if(this.student && this.student.status == 'Inactive') {
            return false;
        }
        return true;
    }
}