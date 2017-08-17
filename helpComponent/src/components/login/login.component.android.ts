import { Component, OnInit } from '@angular/core';
import { SecurityServices } from '../../services/security.services';
import { Constants } from '../../utils/constans';
import { NavController } from 'ionic-angular';
import { PageResolver } from '../../utils/page.resolver';
import { Login } from './login.component';
import { PageService } from '../pageHeader/page.service';
import { PageFooterMobile } from '../pageHeader/pageFooter.component.android';

@Component({
  selector: 'login',
  templateUrl: 'login.component.android.html'
})

export class LoginAndroid extends Login {
  constructor(securityServices: SecurityServices, navController: NavController, pageResolver: PageResolver, pageService: PageService) {
    super(securityServices, navController, pageResolver, pageService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  studentLogin() {
    this.pageService.setLandingPage(PageFooterMobile);
    this.setRoot(PageFooterMobile);
  }

}