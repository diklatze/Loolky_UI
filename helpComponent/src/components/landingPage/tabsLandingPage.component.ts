import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { PageFooterMobile } from '../pageHeader/pageFooter.component.android';
import { PageService } from '../pageHeader/page.service';


@Component({
  template: `<pageFooterMobile  #pageFooterMobile></pageFooterMobile>`
})
export class TabsLandingPage implements AfterViewInit {
  @ViewChild('pageFooterMobile') pageFooterMobile: PageFooterMobile;


  constructor(private pageService: PageService) {
  }

  ngAfterViewInit() {
    this.pageService.pageFooter = this.pageFooterMobile;
  }
}
