import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StudentLandingPage } from './studentLandingPage.component';
import { PageService } from '../pageHeader/page.service';

@Component({
    selector: 'studentLandingPage',
    templateUrl: 'studentLandingPage.component.android.html'
})

export class StudentLandingPageAndroid extends StudentLandingPage {
    constructor(nav: NavController, pageService: PageService) {
        super(nav, pageService);
    }

    ionSelected() {
        //resolves the double tap on tab issue in mobile mode
    }
}