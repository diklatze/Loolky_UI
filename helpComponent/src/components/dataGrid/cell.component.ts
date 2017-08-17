import { Component, Input } from '@angular/core';
import { ColumnInterface } from '../interfaces/uiElements/dataGrid.interface';
import { toDate } from '../../utils/utils';

@Component({
    selector: 'cell',
    template:
    `
    <div *ngIf="columnMetadata?.customFormatter; else noCustomFormatter">{{columnMetadata.customFormatter(value)}}</div>

    <ng-template #noCustomFormatter>
        <ng-container [ngSwitch]="columnMetadata?.fieldType">
            <div *ngSwitchCase="'number'">{{value | number}}</div>
            <div *ngSwitchCase="'Date'">{{toDate(value) | date:'shortDate'}}</div>
            <i *ngSwitchCase="'boolean'" [ngClass]="value? 'toggle on icon': 'toggle off icon'"></i>
            <div *ngSwitchDefault>{{value}}</div>
        </ng-container>
    </ng-template>
    `
})

export class Cell {
    @Input() value: any;
    @Input() columnMetadata: ColumnInterface;

    toDate: Function = toDate;
}