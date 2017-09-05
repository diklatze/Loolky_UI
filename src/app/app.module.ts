import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { SignInPage } from '../pages/signInPage/signInPage';

import { PageHeader } from '../components/pageHeader/pageHeader';
import { PageFooter } from '../components/pageFooter/pageFooter';
import { Cards } from '../components/cards/cards';

//import { Menu } from '../components/menu/menu';

@NgModule({
  declarations: [
    MyApp,
    SignInPage,
    // SignUpPage,
    PageHeader,
    Cards,
    PageFooter,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,

    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PageHeader,
    Cards,
    SignInPage,
    PageFooter,
    // SignUpPage,

    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
