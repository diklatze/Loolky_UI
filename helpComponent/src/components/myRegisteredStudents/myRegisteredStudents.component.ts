import { Component, OnInit } from '@angular/core';
import { PageService } from '../pageHeader/page.service';
import { NavController, LoadingController } from 'ionic-angular';
import { StudentInterface } from '../interfaces/student.interface';
import { MemberServices } from '../../services/member.services';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { ColumnInterface, PageInterface, FilterInterface, MultiSelectionItemInterface } from '../interfaces/uiElements/dataGrid.interface';
import { StudentRegistrationPage } from '../studentRegistration/studentRegistration.component';
import { ItemInterface } from '../interfaces/loan.interface';
import { StudentDetails } from '../studentRegistration/studentDetails.component';
import { getDefaultLoadinOptions } from '../../utils/utils';

@Component({
    selector: 'myRegisteredStudents',
    templateUrl: 'myRegisteredStudents.component.html'
})

export class MyRegisteredStudents implements OnInit {
    pageTitle: string;
    errMessages: any[] = null;
    students: StudentInterface[];
    faculties: MultiSelectionItemInterface[] = [];

    pageInfo: PageInterface = {
        number: 1,
        size: 10
    }

    columns: ColumnInterface[] =
    [
        {
            title: 'Draft',
            fieldName: 'draft',
            fieldType: 'boolean'
        },
        {
            title: 'Email',
            fieldName: 'email',
            fieldType: 'string'
        },
        {
            title: 'First name',
            fieldName: 'givenName',
            fieldType: 'string'
        },
        {
            title: 'Last name',
            fieldName: 'familyName',
            fieldType: 'string'
        },
        {
            title: 'Faculty',
            fieldName: 'faculty.name',
            fieldType: 'multiSelection',
            multiSelectionList: this.faculties
        },
        {
            title: 'Registration date',
            fieldName: 'registrationDate',
            fieldType: 'Date'
        }
    ]

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    constructor(private nav: NavController, private pageService: PageService, private memberServices: MemberServices, private loadingCtrl: LoadingController) {
        this.pageTitle = this.pageService.getMember().fullName + " - My Registered Students";

        memberServices.getFaculties(this.pageService.getMember().shortName).subscribe(
            res => {
                if (res.code == 0 && res.current_data) {
                    res.current_data.forEach((faculty: ItemInterface) => {
                        this.faculties.push({ desc: faculty.name, value: faculty.name });
                    });
                }
                else {
                    console.error("Error while getting faculties: " + res.errors);
                }
            },
            err => {
                console.error("Error while getting faculties: " + err);
            });
    }

    ngOnInit() {
        this.getStudentsData();
    }

    getStudentsData() {
        this.errMessages = null;

        let loading = this.loadingCtrl.create(getDefaultLoadinOptions());

        loading.present();

        this.memberServices.getMemberPageableData(this.pageService.getMember().shortName, 'students', this.pageInfo).subscribe(
            res => {
                if (res.code == 0) {
                    this.students = res.page.content;
                    this.pageInfo = res.page;
                }
                else {
                    this.errMessages = res.errors;
                }

                loading.dismiss();
            },
            err => {
                this.errMessages = [{ "fieldName": "non_field", "errorCode": "", "errorDescription": err }];
                loading.dismiss();
            });
    }

    onPagingEvent(pageInfo: PageInterface) {
        this.pageInfo.number = pageInfo.number;
        this.pageInfo.filter = pageInfo.filter;
        this.pageInfo.sort = pageInfo.sort;
        this.pageInfo.size = pageInfo.size;
        this.getStudentsData();
    }

    onRefresh(pageInfo: PageInterface) {
        this.pageInfo.filter = pageInfo.filter;
        this.pageInfo.sort = pageInfo.sort;
        this.pageInfo.size = pageInfo.size;
        this.pageInfo.number = 1;
        this.getStudentsData();
    }

    onRowDoubleClick(row: StudentInterface) {
        this.nav.push(StudentDetails, { student: row });
    }
}