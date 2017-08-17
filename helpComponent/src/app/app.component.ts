import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SecurityServices } from '../services/security.services';
import { Login } from '../components/login/login.component';
import { LoginAndroid } from '../components/login/login.component.android';
import { Constants } from '../utils/constans';
import { PageResolver } from '../utils/page.resolver';
import { CacheService } from 'ionic-cache';

@Component({
    template: `<ion-nav #nav [root]="rootPage"></ion-nav>`,
    providers: [SecurityServices, PageResolver, StatusBar, SplashScreen],
})
export class MyApp {
    rootPage: any;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private securityServices: SecurityServices, pageResolver: PageResolver, private cache: CacheService) {
        this.rootPage = pageResolver.isMobile()? LoginAndroid: Login;

        this.cache.clearAll();
        console.log("Clearing all the IONIC cache!");
        this.cache.setDefaultTTL(60 * 60 * 3); //set default cache TTL for 3 hours

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            this.securityServices.getAppSetup().subscribe(
                res => {
                    if (res.code == "0") {
                        Constants.PASSWORD_VALIDATION_REGEX = res.passwordPattern;
                    }
                    else {
                        console.error("Can't load application config [err: " + res.code + "]");
                    }
                },
                err => {
                    console.error("Can't load application config [err: " + err + "]");
                });
        });
    }
}
