import { Component, OnInit, Input } from '@angular/core';
import { PageHeader } from './pageHeader.component';
import { MemberServices } from '../../services/member.services';
import { PageService } from '../pageHeader/page.service';
import { EligibleLoans } from '../loan/eligibleLoans.component';
import { EligibleScholarships } from '../scholarship/eligibleScholarships.component';
import { NavController } from 'ionic-angular';
import { StudentMyLoans } from '../studentLoan/studentMyLoans.component';
import { StudentMyScholarships } from '../studentScholarship/studentMyScholarships.component';
import { StudentMyJobOffers } from '../studentJobOffer/studentMyJobOffers.component';
import { StudentSavedLoans } from '../studentLoan/studentSavedLoans.component';
import { StudentSavedScholarships } from '../studentScholarship/studentSavedScholarships.component';
import { StudentSavedJobOffers } from '../studentJobOffer/studentSavedJobOffers.component';
import { EligibleJobOffers } from '../jobOffer/eligibleJobOffers.component';
import { OfferType, OfferStatus } from '../interfaces/offer.interface';
import { StudentRegistrationPage } from '../studentRegistration/studentRegistration.component';

@Component({
    selector: 'pageHeaderMobile',
    templateUrl: 'pageHeader.component.android.html',
    styles: [
        //IOS
        `.toolbar-ios .segment-ios {position: relative;}`,
        `#segmentHeaderSubmenu.segment-ios {padding-top: 2px}`,
        `ion-segment.segment-ios ion-segment-button.segment-button {
            height: 3rem;
            line-height: 1.2rem;
            padding: 3px 1px;            
        }`,
        `#segmentHeaderSubmenu.segment-ios .segment-button {
            border-style: none;
            border-color: white;
            color: danger;
            border-width: thin;
            border-radius: 4px 4px 4px 4px;
            padding-top: 12px;
        }`,

        //Android
        `#segmentHeaderMenu.segment-md .segment-button{
            line-height: 1rem;
            height: 3rem;
            font-size: 1rem;
        }`,
        `#segmentHeaderSubmenu.segment-md .segment-button{
            font-size: 1rem;
            height: 3rem;
            line-height: 3rem;
            padding: 3px 1px;
            text-transform: none;
        }`,
        //Profile button
        `#profileButton{
            position: absolute;
            right: 0;
            z-index: 999;
        }`,
        `#profileButton.bar-button-md{
            top: 10px;
        }`,
        `#profileButton.bar-button-ios{
            font-size: 1.5rem;
        }`
    ]
})
export class PageHeaderAndroid extends PageHeader implements OnInit {
    @Input() pageTitleCounter?: number;
    @Input() hideNavigations?: boolean; //TODO: implement
    @Input() showProfile?: boolean;
    @Input() showProfileTitle?: boolean;
    @Input() pageTitle?: string;

    toggleProfile: boolean = false;

    toolbarMenu: ToolBarMenuInterface = null;
    toolbarSubMenu: ToolBarMenuInterface = null;

    constructor(memberServices: MemberServices, pageService: PageService, nav: NavController) {
        super(memberServices, pageService, nav);
    }

    ngOnInit() {
        this.toolbarMenu = this.pageService.headerMenu;
        this.toolbarSubMenu = null;

        //select sub menu
        if (this.toolbarMenu && this.toolbarMenu.menuItems && this.toolbarMenu.menuItems.length > 0) {
            for (let i = 0; i < this.toolbarMenu.menuItems.length; i++) {
                if (this.toolbarMenu.menuItems[i].value == this.toolbarMenu.selected) {
                    this.toolbarSubMenu = this.toolbarMenu.menuItems[i].subMenu;
                    break;
                }
            }
        }
    }

    showStudentProfile() {
        this.pageService.headerMenu = <ToolBarMenuInterface>{};
        this.nav.push(StudentRegistrationPage, { readOnlyMode: true })
    }

    public static selectedHome = (nav: NavController): ToolBarMenuInterface => {
        return <ToolBarMenuInterface>{};
    }

    public static selectLoans = (nav: NavController): ToolBarMenuInterface => {
        return {
            selected: "myEligibleLoans",
            menuItems: [
                {
                    value: 'myLoans',
                    caption: 'My loans',
                    id: 'myLoansBtn',
                    onSelectFunction: (menuItem: ToolbarMenuItemInterface) => {
                        for (let i = 0; i < menuItem.subMenu.menuItems.length; i++) {
                            if (menuItem.subMenu.selected == menuItem.subMenu.menuItems[i].value) {
                                menuItem.subMenu.menuItems[i].onSelectFunction(menuItem.subMenu.menuItems[i]);
                                break;
                            }
                        }
                    },
                    subMenu: {
                        selected: 'drafts',
                        menuItems: [
                            { value: 'drafts', id: 'draftsBtn', caption: 'Drafts', onSelectFunction: (subMenuItem: ToolbarMenuItemInterface) => { PageHeaderAndroid.navToSavedOffers(nav, OfferType.loanType) } },
                            { value: 'published', id: 'publishedBtn', caption: 'Published', onSelectFunction: (subMenuItem: ToolbarMenuItemInterface) => { PageHeaderAndroid.navToPendingApprovedDeclinedOffer(nav, OfferStatus.pending, OfferType.loanType) } },
                            { value: 'approved', id: 'approvedBtn', caption: 'Approved', onSelectFunction: (subMenuItem: ToolbarMenuItemInterface) => { PageHeaderAndroid.navToPendingApprovedDeclinedOffer(nav, OfferStatus.approved, OfferType.loanType) } },
                            { value: 'declined', id: 'declinedBtn', caption: 'Declined', onSelectFunction: (subMenuItem: ToolbarMenuItemInterface) => { PageHeaderAndroid.navToPendingApprovedDeclinedOffer(nav, OfferStatus.declined, OfferType.loanType) } }
                        ]
                    }
                },
                {
                    value: 'myEligibleLoans',
                    caption: 'My eligible loans',
                    id: 'myEligibleLoansBtn',
                    onSelectFunction: (menuItem: ToolbarMenuItemInterface) => { nav.setRoot(EligibleLoans); },
                    subMenu: null
                },
            ]
        };
    }

    public static selectScholarship = (nav: NavController): ToolBarMenuInterface => {
        return {
            selected: "myEligibleScholarships",
            menuItems: [
                {
                    value: 'myScholarships',
                    caption: 'My scholarships',
                    id: 'myScholarshipsBtn',
                    onSelectFunction: (menuItem: ToolbarMenuItemInterface) => {
                        for (let i = 0; i < menuItem.subMenu.menuItems.length; i++) {
                            if (menuItem.subMenu.selected == menuItem.subMenu.menuItems[i].value) {
                                menuItem.subMenu.menuItems[i].onSelectFunction(menuItem.subMenu.menuItems[i]);
                                break;
                            }
                        }
                    },
                    subMenu: {
                        selected: 'drafts',
                        menuItems: [
                            { value: 'drafts', id: 'draftsBtn', caption: 'Drafts', onSelectFunction: (subMenuItem: ToolbarMenuItemInterface) => { PageHeaderAndroid.navToSavedOffers(nav, OfferType.scholarship) } },
                            { value: 'published', id: 'publishedBtn', caption: 'Published', onSelectFunction: (subMenuItem: ToolbarMenuItemInterface) => { PageHeaderAndroid.navToPendingApprovedDeclinedOffer(nav, OfferStatus.pending, OfferType.scholarship) } },
                            { value: 'approved', id: 'approvedBtn', caption: 'Approved', onSelectFunction: (subMenuItem: ToolbarMenuItemInterface) => { PageHeaderAndroid.navToPendingApprovedDeclinedOffer(nav, OfferStatus.approved, OfferType.scholarship) } },
                            { value: 'declined', id: 'declinedBtn', caption: 'Declined', onSelectFunction: (subMenuItem: ToolbarMenuItemInterface) => { PageHeaderAndroid.navToPendingApprovedDeclinedOffer(nav, OfferStatus.declined, OfferType.scholarship) } }
                        ]
                    }
                },
                {
                    value: 'myEligibleScholarships',
                    caption: 'My eligible scholarships',
                    id: 'myEligibleScholarshipsBtn',
                    onSelectFunction: (menuItem: ToolbarMenuItemInterface) => { nav.setRoot(EligibleScholarships); },
                    subMenu: null
                },
            ]
        };
    }

    public static selectJobOffer = (nav: NavController): ToolBarMenuInterface => {
        return {
            selected: "myEligibleJobOffers",
            menuItems: [
                {
                    value: 'myJobOffers',
                    caption: 'My job offers',
                    id: 'myJobOfferBtn',
                    onSelectFunction: (menuItem: ToolbarMenuItemInterface) => {
                        for (let i = 0; i < menuItem.subMenu.menuItems.length; i++) {
                            if (menuItem.subMenu.selected == menuItem.subMenu.menuItems[i].value) {
                                menuItem.subMenu.menuItems[i].onSelectFunction(menuItem.subMenu.menuItems[i]);
                                break;
                            }
                        }
                    },
                    subMenu: {
                        selected: 'drafts',
                        menuItems: [
                            { value: 'drafts', id: 'draftsBtn', caption: 'Drafts', onSelectFunction: (subMenuItem: ToolbarMenuItemInterface) => { PageHeaderAndroid.navToSavedOffers(nav, OfferType.jobOffer) } },
                            { value: 'published', id: 'publishedBtn', caption: 'Published', onSelectFunction: (subMenuItem: ToolbarMenuItemInterface) => { PageHeaderAndroid.navToPendingApprovedDeclinedOffer(nav, OfferStatus.pending, OfferType.jobOffer) } },
                            { value: 'approved', id: 'approvedBtn', caption: 'Approved', onSelectFunction: (subMenuItem: ToolbarMenuItemInterface) => { PageHeaderAndroid.navToPendingApprovedDeclinedOffer(nav, OfferStatus.approved, OfferType.jobOffer) } },
                            { value: 'declined', id: 'declinedBtn', caption: 'Declined', onSelectFunction: (subMenuItem: ToolbarMenuItemInterface) => { PageHeaderAndroid.navToPendingApprovedDeclinedOffer(nav, OfferStatus.declined, OfferType.jobOffer) } }
                        ]
                    }
                },
                {
                    value: 'myEligibleJobOffers',
                    caption: 'My eligible job offers',
                    id: 'myEligibleJobOfferBtn',
                    onSelectFunction: (menuItem: ToolbarMenuItemInterface) => { nav.setRoot(EligibleJobOffers); },
                    subMenu: null
                },
            ]
        };
    }

    private static navToPendingApprovedDeclinedOffer = (nav: NavController, status: OfferStatus, offerType: OfferType) => {
        let componentByOfferType = {
            [OfferType.scholarship]: StudentMyScholarships,
            [OfferType.loanType]: StudentMyLoans,
            [OfferType.jobOffer]: StudentMyJobOffers
        };

        nav.setRoot(componentByOfferType[offerType], { status: status });
    }

    private static navToSavedOffers = (nav: NavController, offerType: OfferType) => {
        let componentByOfferType = {
            [OfferType.scholarship]: StudentSavedScholarships,
            [OfferType.loanType]: StudentSavedLoans,
            [OfferType.jobOffer]: StudentSavedJobOffers
        };
        nav.setRoot(componentByOfferType[offerType]);
    }

    //do not execute the onClickFunction if clicked on already selected button
    private preventDoubleExecution = (isSubMenu: boolean, selected: string, buttonValue: string, onClickFunction: Function, menuItem: ToolBarMenuInterface) => {
        if (selected != buttonValue) {
            if (isSubMenu) {
                this.toolbarSubMenu.selected = buttonValue;
            }
            else {
                this.toolbarMenu.selected = buttonValue;
            }

            this.pageService.headerMenu = this.toolbarMenu; //Save the menu state
            onClickFunction(menuItem);
        }
    }

}



export interface ToolBarMenuInterface {
    selected: string,
    menuItems: ToolbarMenuItemInterface[]
}

export interface ToolbarMenuItemInterface {
    value: string,
    caption: string,
    id: string,
    onSelectFunction: (ToolBarMenuInterface) => void,
    subMenu?: ToolBarMenuInterface
}