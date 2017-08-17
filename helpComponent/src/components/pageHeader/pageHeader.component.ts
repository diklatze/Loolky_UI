import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { UserType } from '../../utils/constans';
import { MemberServices } from '../../services/member.services';
import { MemberAccountCreatePage } from '../memberAccount/memberAccountCreat.component';
import { MemberAccountDetailsPage } from '../memberAccount/memberAccountDetails.component';
import { RegisterEIContractPage } from '../registerEIContract/registerEIContract.component';
import { RegisterGovContractPage } from '../registerGovContract/registerGovContract.component';
import { RegisterOrganizationContractPage } from '../registerOrganizationContract/registerOrganizationContract.component';
import { ChangePasswordPage } from '../changepassword/changePassword.component';
import { StudentRegistrationPage } from '../studentRegistration/studentRegistration.component';


import { PageService } from '../pageHeader/page.service';
import { NavController } from 'ionic-angular';

declare var $: any;
@Component({
    selector: 'pageHeader',
    templateUrl: 'pageHeader.component.html',
    styles: [
        `.ui.menu .item:before { width: 0 }`,//remove border
    ]
})

export class PageHeader implements OnInit, AfterViewInit {
    @Input() pageTitle?: string;
    @Input() pageTitleCounter?: number;
    @Input() hideNavigations?: boolean;

    username: string = null;
    usertype: string = null;

    isShown: boolean = true;
    UserType = UserType;

    static ACC_DETAIS_MENU: string = "accdetails";
    static REGISTER_MENU: string = "register";
    static CHANGE_PASSWORD_MENU: string = "changepassword";
    static HOME_BUTTON_MENU: string = "home";
    static STUDENT_PROFILE_MENU: string = "readOnlyMode";

    public show() {
        this.isShown = true;
    }

    protected getCounter(): string {
        return (this.pageTitleCounter != undefined && this.pageTitleCounter != null) ? ' (' + this.pageTitleCounter + ')' : '';
    }

    public hide() {
        this.isShown = false;
    }

    protected getUsername(): string {
        return this.username;
    }

    protected setUsername(username: string) {
        this.username = username;
    }

    protected getUsertype(): string {
        return this.usertype;
    }

    protected setUsertype(usertype: string) {
        this.usertype = usertype;
        this.initMenuCombo();
    }

    public get ACC_DETAIS_MENU(): String {
        return PageHeader.ACC_DETAIS_MENU;
    }

    public get REGISTER_MENU(): String {
        return PageHeader.REGISTER_MENU;
    }

    public get STUDENT_PROFILE_MENU(): String {
               return PageHeader.STUDENT_PROFILE_MENU;

    }


    public get CHANGE_PASSWORD_MENU(): String {
        return PageHeader.CHANGE_PASSWORD_MENU;
    }

    public get HOME_BUTTON_MENU(): String {
        return PageHeader.HOME_BUTTON_MENU;
    }

    constructor(private memberServices: MemberServices, protected pageService: PageService, protected nav: NavController) {
        this.setUsername(pageService.getUsername());
        this.setUsertype(pageService.getUsertype());
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    initMenuCombo() {
        //required by http://semantic-ui.com to support menu
        if (this.usertype == String(UserType.EIUser) || this.usertype == String(UserType.Government) || this.usertype == String(UserType.Student) || this.usertype == String(UserType.Organization) ||
            this.usertype == String(UserType.Marketplace)) {
            setTimeout(() => {
                $('#menuCombo.notinitialized').dropdown({ action: 'nothing' }); //do not select the value on click
                $('#menuCombo').removeClass('notinitialized');
            })
        }
    }

    onMenuClick(menuName: string) {
        switch (menuName) {
            case PageHeader.ACC_DETAIS_MENU:
                console.log('Account Details Menu clicked on pageHeader');
                this.memberServices.getMemberAccountDetails(this.pageService.getMember().shortName).subscribe(
                    res => {
                        console.log(res.code);
                        switch (res.code) {
                            case 0:
                                this.nav.push(MemberAccountDetailsPage, { balance: res.balance });
                                break;
                            case 586:
                                this.nav.push(MemberAccountCreatePage);
                                break;
                        }
                    },
                    err => {
                        console.error(err);
                    });
                break;

            case PageHeader.CHANGE_PASSWORD_MENU:
                this.nav.push(ChangePasswordPage, { enablePageHeaderNavigation: true });
                break;

            case PageHeader.STUDENT_PROFILE_MENU:
                this.nav.push(StudentRegistrationPage, { readOnlyMode: true });                
                break;

            case PageHeader.REGISTER_MENU:
                console.log('Register Menu clicked on  pageHeader shortname ' + this.pageService.getMember().shortName);
                if (this.usertype == String(UserType.Marketplace)) {
                    break;
                }
                else if (this.usertype == String(UserType.EIUser)) {
                    this.nav.push(RegisterEIContractPage);
                }
                else if (this.usertype == String(UserType.Government)) {
                    this.nav.push(RegisterGovContractPage);
                }
                else {
                    this.nav.push(RegisterOrganizationContractPage);
                }

                break;

            case PageHeader.HOME_BUTTON_MENU:
                //check if we are not on the landing page already
                if (this.nav.getActive() != this.nav.first()) {
                    this.nav.popToRoot();
                }

                break;
        }

    }
}