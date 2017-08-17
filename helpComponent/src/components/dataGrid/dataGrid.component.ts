import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ColumnInterface, PageInterface, FilterInterface, SortInterface, SortDirectionEnum } from '../interfaces/uiElements/dataGrid.interface';
import { Filter, FilterFieldValueInterface } from './filter.component';
import { getInnerObjectProperty, isNullOrUndefined } from '../../utils/utils';

declare var $: any;

@Component({
    selector: 'dataGrid',
    templateUrl: 'dataGrid.component.html',
    styles: [
        `.right-aligned{right: 0; position: absolute; padding-right: 25px;}`,
        `.left-aligned{left: 0; position: absolute; padding-left: 25px; padding-top: 5px;}`,
        `tr th.no-bottom-border{border-bottom: 0}`,
        `tr th.no-bottom-padding{padding-bottom: 0}`,
    ]
})

export class DataGrid implements AfterViewInit {
    @Input() data: any[];
    @Input() columns: ColumnInterface[];
    @Input() pageInfo: PageInterface;
    @Input() cellMarkFunction?: (row: any, fieldName: string) => '' | 'warning' | 'positive' | 'negative';

    @Output() onPaging: EventEmitter<PageInterface> = new EventEmitter<PageInterface>();
    @Output() onFiltering: EventEmitter<PageInterface> = new EventEmitter<PageInterface>();
    @Output() onSorting: EventEmitter<PageInterface> = new EventEmitter<PageInterface>();
    @Output() onPageSizeChange: EventEmitter<PageInterface> = new EventEmitter<PageInterface>();
    @Output() onRowDoubleClick: EventEmitter<any> = new EventEmitter<any>();

    getInnerObjectProperty: Function = getInnerObjectProperty;
    SortDirectionEnum = SortDirectionEnum;

    @ViewChildren('filter') dynamicFieldsQueryList: QueryList<Filter>;
    @ViewChild('numOfRowsCombo') set numOfRowsComboSetter(elRef: ElementRef) {
        if (elRef && !elRef.nativeElement.classList.contains('initialized')) {
            $(elRef.nativeElement).
                dropdown('set selected', this.pageInfo.size).
                dropdown({
                    onChange: (value, text, $choice) => {
                        this.pageSize = (+value);
                        this.onPageSizeEvent();
                    }
                });
            elRef.nativeElement.classList.add('initialized');
        }
    }

    sort: SortInterface = {};

    pageSizeArr: number[] = [5, 10, 20, 30, 50, 100];
    pageSize: number;

    ngAfterViewInit() {
        this.pageSize = this.pageInfo.size;
    }

    onPageSizeEvent() {
        this.onPageSizeChange.emit(this.populatePageInterfaceObject());
    }

    onPagingEvent(pageNumber) {
        this.onPaging.emit(this.populatePageInterfaceObject(pageNumber));
    }

    populatePageInterfaceObject(pageNumber?: number, ignoreCollectFilterInfo?: boolean): PageInterface {
        return {
            filter: ignoreCollectFilterInfo ? null : this.collectFilterInfo(),
            number: isNullOrUndefined(pageNumber) ? null : pageNumber,
            sort: this.sort,
            size: this.pageSize
        }
    }

    clearFilter() {
        this.dynamicFieldsQueryList.forEach(filterComponent => {
            filterComponent.setFilterValue(null);
        });

        this.refresh(true);
    }

    onSortClicked(fieldName: string) {
        if (this.onSorting.observers && this.onSorting.observers.length == 0) {
            return;
        }

        switch (this.sort[fieldName]) {
            case undefined:
                this.sort = {};
                this.sort[fieldName] = SortDirectionEnum.ASC;
                break;
            case SortDirectionEnum.ASC:
                this.sort[fieldName] = SortDirectionEnum.DESC;
                break;
            default:
                this.sort = {};
        }

        this.refresh();
    }

    refresh(ignoreCollectFilterInfo?: boolean) {
        this.onFiltering.emit(this.populatePageInterfaceObject(undefined, ignoreCollectFilterInfo));
    }

    onFilteringByEnterKey(event: any) {
        this.refresh();
    }

    collectFilterInfo(): FilterInterface {
        let filtersObj: FilterInterface = {};
        let isAnyFilters: boolean = false;

        this.dynamicFieldsQueryList.forEach(filterComponent => {
            let filter: FilterFieldValueInterface = filterComponent.getFilterValue();
            if (filter) {
                filtersObj[filter.fieldName] = filter.filterValue;
                isAnyFilters = true;
            }
        });

        return (isAnyFilters ? filtersObj : null);
    }

    onRowDblClick(event, row: any) {
        this.onRowDoubleClick.emit(row);
    }

    isOnPagingEventRegistered(): boolean {
        let length: number = getInnerObjectProperty(this.onPaging, 'observers.length');
        return (length > 0);
    }
}