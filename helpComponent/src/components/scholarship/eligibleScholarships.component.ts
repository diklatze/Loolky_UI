import { Component, OnInit } from '@angular/core';
import { UserType, Constants } from '../../utils/constans';
import { getFormattedDate } from '../../utils/utils';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { MessageServices } from '../../services/message.services';
import { MemberServices } from '../../services/member.services';
import { ScholarshipInterface } from '../interfaces/scholarship.interface';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { ViewedTypeEnum, StripModeEnum } from '../interfaces/types.interface';
import { ScholarshipPage } from './scholarshipPage.component';
import { PageService } from '../pageHeader/page.service';
import { StudentInterface } from '../interfaces/student.interface';
import { MemberInterface } from '../interfaces/member.interface';
import { AddOffer } from '../offer/addOffer.component';
import { OfferType } from '../interfaces/offer.interface';
import { CacheService } from 'ionic-cache';

@Component({
  selector: 'eligibleScholarships',
  templateUrl: 'eligibleScholarships.component.html',
  styles: [
    `.viewed {background-color:lightgray;}`,
    `.dh-table {border-spacing: 0 0em;}`,
    `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
    `td .padding-right {padding: 0px 5px 0px 0px;}`,
  ]
})
export class EligibleScholarships implements OnInit {
  isOrganizationSavedOnlyScholarship: boolean = false;

  pageTitle: string;
  pageTitleCounter: number = null;

  username: string;

  member: StudentInterface | MemberInterface;

  scholarships: ScholarshipInterface[] = [];

  eligibleScholarshipFields: FieldInterface[] = [];

  studentEligibleScholarshipFields: FieldInterface[] = [
    {
      name: "organization",
      id: "organizationTxt",
      text: "Organization:"
    },
    {
      name: "info.maxAmount",
      id: "maxAmountTxt",
      text: "Max Amount:"
    },
    {
      name: "info.openDate",
      id: "openDateDate",
      formatter: getFormattedDate,
      text: "Open date:"
    },
    {
      name: "info.applicationDeadline",
      id: "deadlineDateDate",
      formatter: getFormattedDate,
      text: "Application Deadline:"
    }
  ];

  organizationEligibleScholarshipFields: FieldInterface[] = [
    {
      name: "info.openDate",
      id: "openDateDate",
      formatter: getFormattedDate,
      text: "Open date:"
    },
    {
      name: "info.applicationDeadline",
      id: "deadlineDateDate",
      formatter: getFormattedDate,
      text: "Application Deadline:"
    }
  ];

  viewedScholarships: string[] = [];

  viewedType = ViewedTypeEnum; //required in order to use it in the html template

  scholarshipStripMode: StripModeEnum = StripModeEnum.ELIGIBLE;
  hideheart: boolean;

  constructor(public nav: NavController, navParams: NavParams, private messageServices: MessageServices, private memberServices: MemberServices, private platform: Platform, private pageService: PageService, private cache: CacheService) {
    if (this.pageService.getUsertype() == UserType.Student.toString()) {
      this.username = this.pageService.getStudent().email;
      this.member = this.pageService.getStudent();
      this.pageTitle = "Eligible scholarships";
      this.hideheart = false;
    }
    else if (this.pageService.getUsertype() == UserType.Organization.toString()) {
      this.username = this.pageService.getUsername();
      this.member = this.pageService.getMember();
      this.isOrganizationSavedOnlyScholarship = navParams.get('savedOnly') === true;
      this.pageTitle = this.pageService.getMember().fullName + ' - ' + (this.isOrganizationSavedOnlyScholarship ? "Saved scholarships" : "Scholarships");
      this.hideheart = true;
    }
  }

  getCacheKey() {
    return Constants.ELIGIBLE_SCHOLARSHIP_CACHE + '_' + this.username;
  }

  changePageTitleCounter(): void {
    this.pageTitleCounter = this.scholarships ? this.scholarships.length : 0;
  }

  ngOnInit() {
    this.cache.getItem(this.getCacheKey()).catch(() => { }).then((data) => {
      if (data) {
        this.viewedScholarships = data;
      }
    });
  }

  getEligibleScholarships() {
    this.memberServices.getEligibleScholarships((<StudentInterface>this.member).email).subscribe(
      res => {
        switch (res.code) {
          case 0:
            this.scholarships = res.strips;
            for (let scholarship of this.scholarships) {
              if (this.viewedScholarships.indexOf(scholarship.info.name) != -1) {
                scholarship.viewed = ViewedTypeEnum.VIEWED;
              }
            }
            this.changePageTitleCounter();
            break;

          default:
            console.error('Failed to load eligible scholarships. Error code: ' + res.code);
        }
      },
      err => {
        console.error('Failed to load eligible scholarships');
        console.error(err);
      }
    )
  }

  getOrganizationScholarships() {
    this.memberServices.getOrganizationScholarships((<MemberInterface>this.member).shortName, this.isOrganizationSavedOnlyScholarship).subscribe(
      res => {
        switch (res.code) {
          case 0:
            this.scholarships = res.scholarships || [];
            this.changePageTitleCounter();
            break;

          default:
            console.error('Failed to load scholarships. Error code: ' + res.code);
        }
      },
      err => {
        console.error('Failed to load scholarships');
        console.error(err);
      }
    )
  }

  loadScholarship = (index: number): void => {
    let page: any = ScholarshipPage;
    let navigationParams: any = {};

    if (this.pageService.getUsertype() == UserType.Organization.toString()) {
      page = AddOffer;
      navigationParams.readOnly = !this.isOrganizationSavedOnlyScholarship;
      navigationParams.offerType = OfferType.scholarship;
      navigationParams.offer = this.scholarships[index];
    }
    else {
      navigationParams.scholarship = this.scholarships[index];
    }

    this.nav.push(page, navigationParams).then(() => {
      this.scholarships[index].viewed = this.isOrganizationSavedOnlyScholarship ? ViewedTypeEnum.NOT_VIEWED : ViewedTypeEnum.VIEWED;
      if (this.viewedScholarships.indexOf(this.scholarships[index].info.name) == -1) {
        this.viewedScholarships.push(this.scholarships[index].info.name);
        this.cache.saveItem(this.getCacheKey(), this.viewedScholarships);
      }
    });
  }

  ionViewWillEnter() {
    this.scholarships = [];
    if (this.pageService.getUsertype() == UserType.Organization.toString()) {
      this.eligibleScholarshipFields = this.organizationEligibleScholarshipFields;
      //load the list of saved scholarships on each page entrance
      if (this.isOrganizationSavedOnlyScholarship) {
        this.getOrganizationScholarships();
      }
    } else if (this.pageService.getUsertype() == UserType.Student.toString()) {
      this.eligibleScholarshipFields = this.studentEligibleScholarshipFields;
      this.getEligibleScholarships();
    }

    if (this.scholarships) {
      //filter out all the applied scholarship which might be changed by in other components
      this.scholarships = this.scholarships.filter((scholarship: ScholarshipInterface, index: number, array: ScholarshipInterface[]) => {
        return scholarship.viewed != this.viewedType.SUBMITTED;
      });
    }

    this.changePageTitleCounter();
  }

  ionSelected() {
    //resolves the double tap on tab issue in mobile mode
  }
}