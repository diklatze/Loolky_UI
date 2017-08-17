import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { PageInterface } from '../interfaces/uiElements/dataGrid.interface';

declare var $: any;

@Component({
    selector: 'paginator',
    templateUrl: 'paginator.components.html'
})

export class Paginator implements OnChanges {
    @Input() pageInfo: PageInterface;
    @Output() onPaging: EventEmitter<number> = new EventEmitter<number>();

    @ViewChild('pageNumberCombo') pageNumberDropdownElementRef: ElementRef;

    MAX_PAGES_PER_PAGINATOR: number = 5;
    pages: number[] = [];
    lastPageNumber: number;
    chosenPageNumber: number;
    allPages: number[] = [];

    onPageChoice(pageNumber: number) {
        if (pageNumber == this.chosenPageNumber) {
            return;
        }
        this.chosenPageNumber = pageNumber;
        this.onPaging.emit(this.chosenPageNumber);
    }

    onPrevSelection() {
        if (this.chosenPageNumber > 1) {
            this.chosenPageNumber--;

            this.onPaging.emit(this.chosenPageNumber);

            if (this.chosenPageNumber < this.pages[0]) {
                this.generatePagesArray();
            }
        }
    }

    onFirstSelection() {
        if (this.chosenPageNumber != 1) {
            this.chosenPageNumber = 1;

            this.onPaging.emit(this.chosenPageNumber);

            if (this.chosenPageNumber < this.pages[0]) {
                this.generatePagesArray();
            }
        }
    }

    onNextSelection() {
        if (this.chosenPageNumber < this.lastPageNumber) {
            this.chosenPageNumber++;

            this.onPaging.emit(this.chosenPageNumber);

            if (this.chosenPageNumber > this.pages[this.pages.length - 1]) {
                this.generatePagesArray();
            }
        }
    }

    onLastSelection() {
        if (this.chosenPageNumber != this.lastPageNumber) {
            this.chosenPageNumber = this.lastPageNumber;

            this.onPaging.emit(this.chosenPageNumber);

            if (this.chosenPageNumber > this.pages[this.pages.length - 1]) {
                this.generatePagesArray();
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['pageInfo'] && this.pageInfo) {
            this.chosenPageNumber = this.pageInfo.number;
            this.lastPageNumber = Math.ceil(this.pageInfo.totalElements / this.pageInfo.size);
            this.allPages = new Array(this.lastPageNumber);
            this.generatePagesArray();

            setTimeout(() => {
                $(this.pageNumberDropdownElementRef.nativeElement).
                    dropdown('set selected', this.chosenPageNumber).
                    dropdown({
                        onChange: (value, text, $choice) => {
                            this.onPageChoice(+value);
                        }
                    });
            });
        }
    }

    generatePagesArray() {
        this.pages = [];
        let bigPageNumber = Math.ceil(this.chosenPageNumber / this.MAX_PAGES_PER_PAGINATOR);

        this.pages[0] = ((bigPageNumber - 1) * this.MAX_PAGES_PER_PAGINATOR) + 1;
        for (let i = 1; (i < this.MAX_PAGES_PER_PAGINATOR && this.pages[i - 1] < this.lastPageNumber); i++) {
            this.pages[i] = this.pages[i - 1] + 1;
        }
    }
}