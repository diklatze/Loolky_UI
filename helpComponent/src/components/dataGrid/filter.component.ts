import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ColumnInterface, FilterInterface } from '../interfaces/uiElements/dataGrid.interface';
import { filterDigitsOnly, isNullOrUndefined } from '../../utils/utils';

declare var $: any;

export interface FilterFieldValueInterface { fieldName: string, filterValue: string };

@Component({
    selector: 'filter',
    styles: [
        //Dropdown field style: see 'main.css'

        //Input field
        `.ui.mini.input{font-size: 1em}`,
        `.ui.input input{padding: 0.4em 0.4em}`
    ],
    template:
    `
    <ng-container [ngSwitch]="columnMetadata?.fieldType">

        <select *ngSwitchCase="'boolean'" [attr.name]="columnMetadata.fieldType" #dropdown class="ui mini boolean fluid dropdown" [(ngModel)]="filterValue">
            <option value="null"></option>
            <option value="true">yes <i class="toggle on icon"></i></option>
            <option value="false">no <i class="toggle off icon"></i></option>
        </select>

        <select *ngSwitchCase="'multiSelection'" [attr.name]="columnMetadata.fieldType" #dropdown class="ui mini fluid dropdown" [(ngModel)]="filterValue">
            <option value="null"></option>
            <option *ngFor="let opt of columnMetadata?.multiSelectionList" [value]="opt?.value">{{opt?.desc}}</option>
        </select>

        <div *ngSwitchDefault [attr.name]="columnMetadata.fieldType" class="ui mini input fluid">
            <input type="text" (keypress)="filterKeyPress($event)" [(ngModel)]="filterValue">
        </div>

    </ng-container>
    `
})

export class Filter implements AfterViewInit {
    @Input() columnMetadata: ColumnInterface;

    @ViewChild('dropdown') dropdownElementRef: ElementRef;

    filterValue: number | string | boolean = null;

    public getFilterValue(): FilterFieldValueInterface {
        if (isNullOrUndefined(this.filterValue) || this.filterValue == 'null' || !this.columnMetadata) {
            return null;
        }

        let filter: FilterFieldValueInterface = { fieldName: this.columnMetadata.fieldName, filterValue: '' + this.filterValue };
        return filter;
    }

    public setFilterValue(value: number | string | boolean) {
        this.filterValue = value;

        if (this.dropdownElementRef) {
            $(this.dropdownElementRef.nativeElement).dropdown('set selected', '' + value);
        }
    }

    filterKeyPress(event: KeyboardEvent): boolean {
        if ('number' == this.columnMetadata.fieldType) {
            return filterDigitsOnly(event);
        }
        return true;
    }

    ngAfterViewInit() {
        if (this.dropdownElementRef) {
            $(this.dropdownElementRef.nativeElement).dropdown();
        }
    }
}