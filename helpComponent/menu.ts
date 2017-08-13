import { Component, ViewChild, Directive, ElementRef, OnDestroy, OnInit, Input } from '@angular/core';

declare var $: any

@Component({
  selector: 'menu',
  templateUrl: 'menu.html'
})
export class Menu implements OnInit {

  @ViewChild('descriptionAccordion') descriptionAccordionElementRef: ElementRef;
  @ViewChild('menuPopup') menuPopupElementRef: ElementRef;

  constructor() { }

  ngOnInit() {
    $(this.descriptionAccordionElementRef.nativeElement)
      .accordion();

    $(this.menuPopupElementRef.nativeElement)
      .popup({
        inline: true,
        hoverable: true,
        position: 'bottom left',
        delay: {
          show: 300,
          hide: 800
        }
      })
      ;
  }
}
