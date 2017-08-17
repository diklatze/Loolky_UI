import { Component, OnInit } from '@angular/core';
import { PageService } from '../pageHeader/page.service';
import { NavController, LoadingController } from 'ionic-angular';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { ColumnInterface, PageInterface, FilterInterface, MultiSelectionItemInterface } from '../interfaces/uiElements/dataGrid.interface';
import { AggregationsService } from '../../services/aggregations.services';
import { Histogram, bucket } from '../interfaces/aggregation.interface'

@Component({
    selector: 'studentLoanAggregations',
    templateUrl: 'studentLoanAggregations.component.html',
    providers: [AggregationsService]
})

export class StudentLoanAggregations implements OnInit {
    pageTitle: string;
    errMessages: any[] = null;
    aggregations: Histogram;

    pageInfo: PageInterface = {
        number: 1,
        size: 12
    }

    aggregationByMonth: ColumnInterface[] =
    [
        {
            title: 'Month',
            fieldName: 'key_as_string',
            fieldType: 'Date'
        },
        {
            title: 'Government',
            fieldName: 'gov.buckets.length',
            fieldType: 'string'
        },
        {
            title: 'Country',
            fieldName: 'countries.buckets.length',
            fieldType: 'string'
        },
        {
            title: 'Faculty',
            fieldName: 'faculty.buckets.length',
            fieldType: 'string'
        },
        {
            title: 'Pending',
            fieldName: 'status.Pending',
            fieldType: 'string'
        },
        {
            title: 'Approved',
            fieldName: 'status.Approved',
            fieldType: 'string'
        },
        {
            title: 'Declined',
            fieldName: 'status.Declined',
            fieldType: 'string'
        }
    ];

    aggregationByFaculty: ColumnInterface[] =
    [
        {
            title: 'Faculty',
            fieldName: 'key',
            fieldType: 'string'
        },
        {
            title: 'Government',
            fieldName: 'gov.buckets.length',
            fieldType: 'string'
        },
        {
            title: 'Country',
            fieldName: 'countries.buckets.length',
            fieldType: 'string'
        },
        {
            title: 'Pending',
            fieldName: 'status.Pending',
            fieldType: 'string'
        },
        {
            title: 'Approved',
            fieldName: 'status.Approved',
            fieldType: 'string'
        },
        {
            title: 'Declined',
            fieldName: 'status.Declined',
            fieldType: 'string'
        }
    ];

    aggregationColumnsMap: { [index: string]: ColumnInterface[] } = { Month: this.aggregationByMonth, Faculty: this.aggregationByFaculty };

    // Define columns according to aggregation fileld
    columns: ColumnInterface[];
    
    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;
    
    level: number = 1;

    constructor(private nav: NavController, private pageService: PageService, private aggrServices: AggregationsService, private loadingCtrl: LoadingController) {
        this.pageTitle = this.pageService.getMember().fullName + " - Student Loans";

    }

    ngOnInit() {
        this.getData();
    }

    getData(row?: bucket) {
        
        switch (this.level) {
    	case 1:
    	    this.columns = this.aggregationColumnsMap.Month;
            this.errMessages = null;

            this.aggrServices.getEventsOverTimeStudentLoan().subscribe(
                res => {
                    this.aggregations = res.aggregations.events_over_type;

                    if (this.aggregations && this.aggregations.buckets) {

                        this.aggregations.buckets.map(element => {
                            if (element.status.buckets) {
                                for (let i = 0; i < element.status.buckets.length; i++) {
                                    let arrayElement = element.status.buckets[i];
                                    element.status[arrayElement.key] = arrayElement.doc_count;
                                }
                            }
                            return element;
                        });
                    }
                    this.pageInfo.totalElements = res.aggregations.events_over_type.buckets.length;
                },
                err => {
                    this.errMessages = [{ "fieldName": "non_field", "errorCode": "", "errorDescription": err }];
                });
    		break;
    		
    	case 2:
    	    this.columns = this.aggregationColumnsMap.Faculty;
            this.errMessages = null;
            let from = new Date(row.key);
            let to = new Date(row.key);
            to.setMonth(to.getMonth() + 1);
            this.aggrServices.getEventsOverFacultiesStudentLoan(from, to).subscribe(
                res => {
                    this.aggregations = res.aggregations.events_over_type;

                    if (this.aggregations && this.aggregations.buckets) {

                        this.aggregations.buckets.map(element => {
                            if (element.status.buckets) {
                                for (let i = 0; i < element.status.buckets.length; i++) {
                                    let arrayElement = element.status.buckets[i];
                                    element.status[arrayElement.key] = arrayElement.doc_count;
                                }
                            }
                            return element;
                        });
                    }
                    this.pageInfo.totalElements = res.aggregations.events_over_type.buckets.length;
                },
                err => {
                    this.errMessages = [{ "fieldName": "non_field", "errorCode": "", "errorDescription": err }];
                });
    	    break;
    	default:
    		break;
}
        
    }

    onRowDoubleClick(row: bucket) {
        if(this.level < 2){
            this.level += 1;
            this.getData(row);
        }        
    }
    
    onLevelUp(){
        if(this.level > 1){
            this.level -= 1;
            this.getData();
        }
    }

}