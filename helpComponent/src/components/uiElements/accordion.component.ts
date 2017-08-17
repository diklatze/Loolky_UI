import { Component, AfterViewInit, Input, SimpleChanges, OnChanges, ViewChild, ElementRef } from '@angular/core';

declare var $: any;

@Component({
  selector: 'accordion',
  templateUrl: 'accordion.component.html',
})
export class Accordion implements AfterViewInit, OnChanges {
  @Input() isNested?: string; //Should not initialize if nested. The top accordion container will initialize all the sons
  @Input() id: string;
  @Input() isOpen?: boolean;
  @Input() showExpandAllButton?: boolean = false;
  @Input() title: string;
  @ViewChild('accordion') accordionElementRef: ElementRef;
  @ViewChild('accordionTitle') accordionTitleElementRef: ElementRef;

  ngAfterViewInit() {
    if (!this.isNested) {
      $(this.accordionElementRef.nativeElement).accordion();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      const action: string = this.getAction(changes['isOpen'].currentValue);
      const index: number = 0;
      setTimeout(() => { $(this.accordionElementRef.nativeElement).accordion(action, index); });
    }
  }

  getAction(isOpen: boolean): string {
    return isOpen === true ? 'open' : 'close';
  }

  isAllExpanded(): boolean {
    if (!this.showExpandAllButton || !this.accordionTitleElementRef || !this.accordionElementRef) {
      return null;
    }

    let isCurrentElementCollapsed: boolean = this.accordionTitleElementRef.nativeElement.classList.contains("active");

    return isCurrentElementCollapsed && (this.getNumberOfNestedAccordions() == this.accordionElementRef.nativeElement.querySelectorAll('accordion div.title.active').length-1);
  }

  getNumberOfNestedAccordions(): number {
    return this.accordionElementRef.nativeElement.querySelectorAll('.accordion').length;
  }

  expandAll(event: Event) {
    let numOfNestedAccordions: any = this.getNumberOfNestedAccordions();
    let action: string = this.isAllExpanded() ? 'close' : 'open';

    for (let i = 0; i <= numOfNestedAccordions; i++) {
      $(this.accordionElementRef.nativeElement).accordion(action, i);
    }

    event.stopPropagation();
  }
}