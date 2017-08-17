import { Component } from '@angular/core';
import { PageService } from '../pageHeader/page.service';
import { NavController } from 'ionic-angular';

declare var $: any;

@Component({
    selector: 'pageFooter',
    template: ``,
})

export class PageFooter {
    isShown: boolean = true;

    constructor(protected pageService: PageService, protected nav: NavController) {
    }

    show() {
        this.isShown = true;
    }

    hide() {
        this.isShown = false;
    }
}