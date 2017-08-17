import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { ForgotPassword } from '../components/forgotPassword/forgotPassword.component';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Login } from '../components/login/login.component';
import { LoginAndroid } from '../components/login/login.component.android';
import { PageHeader } from '../components/pageHeader/pageHeader.component';
import { EiLandingPage } from '../components/landingPage/eiLandingPage.component';
import { StudentRegistrationPage } from '../components/studentRegistration/studentRegistration.component';
import { StudentDetails } from '../components/studentRegistration/studentDetails.component';
import { Signup } from '../components/signup/signup.component';
import { StudentLandingPage } from '../components/landingPage/studentLandingPage.component';
import { GovermentLandingPage } from '../components/landingPage/govermentLandingPage.component';
import { MarketplaceLandingPage } from '../components/landingPage/marketplaceLandingPage.component';
import { MemberUserCreation } from '../components/user/memberUserCreation.component';
import { MemberPage } from '../components/member/member.component';
import { ChangePasswordPage } from '../components/changepassword/changePassword.component';
import { RegisterEIContractPage } from '../components/registerEIContract/registerEIContract.component';
import { RegisterGovContractPage } from '../components/registerGovContract/registerGovContract.component';
import { MemberAccountCreatePage } from '../components/memberAccount/memberAccountCreat.component';
import { MemberAccountDetailsPage } from '../components/memberAccount/memberAccountDetails.component';
import { ModalMessage } from '../components/modalMessage/modalMessage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentLandingPageAndroid } from '../components/landingPage/studentLandingPage.component.android';
import { PageHeaderAndroid } from '../components/pageHeader/pageHeader.component.android';
import { PageFooterMobile } from '../components/pageHeader/pageFooter.component.android';
import { PageFooter } from '../components/pageHeader/pageFooter.component';
import { CacheModule } from "ionic-cache";
import { ListManage } from '../components/listManage/listManage.component';
import { CertifiedEI } from '../components/certifiedEI/certifiedEI.component';
import { Faculties } from '../components/faculties/faculties.component';
import { LoanCategories } from '../components/loanCategories/loanCategories.component';
import { HTTPServices } from '../services/httpServices.services';
import { Association } from '../components/association/association.component';
import { EligibleLoans } from '../components/loan/eligibleLoans.component';
import { LoanType } from '../components/loan/loanType.component';
import { LoanTypePage } from '../components/loan/loanTypePage.component';
import { InfoLoanType } from '../components/loan/infoLoanType.component';
import { AppliedLoans } from '../components/studentLoan/appliedLoans.component';
import { StudentLoanPage } from '../components/studentLoan/studentLoanPage.component';
import { TabsLandingPage } from '../components/landingPage/tabsLandingPage.component';
import { MemberServices } from '../services/member.services';
import { MessageServices } from '../services/message.services';
import { PageService } from '../components/pageHeader/page.service';
import { StudentLoanStrip } from '../components/studentLoan/studentLoanStrip.component';
import { StudentMyLoans } from '../components/studentLoan/studentMyLoans.component';
import { LoanTypeStrip } from '../components/loan/loanTypeStrip.component';
import { StudentSavedLoans } from '../components/studentLoan/studentSavedLoans.component';
import { MemberAccountSendFunds } from '../components/memberAccount/memberAccountSendFunds.component';
import { AddOffer } from '../components/offer/addOffer.component';
import { InfoScholarship } from '../components/scholarship/infoScholarship.component';
import { EligibilityOffer } from '../components/offer/eligibilityOffer.component';
import { TermsAndConditionsOffer } from '../components/offer/termsAndConditionsOffer.component';
import { OrganizationLandingPage } from '../components/landingPage/organizationLandingPage.component';
import { RegisterOrganizationContractPage } from '../components/registerOrganizationContract/registerOrganizationContract.component';
import { Accordion } from '../components/uiElements/accordion.component';
import { Visualize } from '../components/uiElements/visualize.component';
import { TransactionState } from '../components/offer/transactionState.component';
import { SafePipe } from '../components/pipes/safePipe.pipe';
import { Dashboard } from '../components/chart/dashboard.component';
import { Scholarship } from '../components/scholarship/scholarship.component';
import { ScholarshipPage } from '../components/scholarship/scholarshipPage.component';
import { ScholarshipStrip } from '../components/scholarship/scholarshipStrip.component';
import { EligibleScholarships } from '../components/scholarship/eligibleScholarships.component';
import { MyDatePickerModule } from 'mydatepicker';
import { NumericConstraints } from '../components/dynamicFields/constraints/numericConstraints.component';
import { MappingConstraints } from '../components/dynamicFields/constraints/mappingConstraints.component';
import { DateConstraints } from '../components/dynamicFields/constraints/dateConstraints.component';
import { ListConstraints } from '../components/dynamicFields/constraints/listConstraints.component';
import { FieldMetadata } from '../components/dynamicFields/fieldMetadata.component';
import { KeysPipe } from '../components/pipes/keysPipe.pipe';
import { NumericRepresentation } from '../components/dynamicFields/representation/numericRepresentation.component';
import { DynamicFieldRepresentation } from '../components/dynamicFields/representation/dynamicFieldRepresentation.component';
import { DateRepresentation } from '../components/dynamicFields/representation/dateRepresentation.component';
import { ListRepresentation } from '../components/dynamicFields/representation/listRepresentation.component';
import { FreeTextRepresentation } from '../components/dynamicFields/representation/freeTextRepresentation.component';
import { AppliedScholarships } from '../components/studentScholarship/appliedScholarships.component';
import { StudentScholarshipStrip } from '../components/studentScholarship/studentScholarshipStrip.component';
import { StudentJobOfferStrip } from '../components/studentJobOffer/studentJobOfferStrip.component';
import { StudentScholarshipPage } from '../components/studentScholarship/studentScholarshipPage.component';
import { StudentSavedScholarships } from '../components/studentScholarship/studentSavedScholarships.component';
import { StudentSavedJobOffers } from '../components/studentJobOffer/studentSavedJobOffers.component';
import { StudentMyScholarships } from '../components/studentScholarship/studentMyScholarships.component';
import { StudentMyJobOffers } from '../components/studentJobOffer/studentMyJobOffers.component';
import { DynamicFieldValue } from '../components/dynamicFields/dynamicFieldValue.component';
import { InfoJobOffer } from '../components/jobOffer/infoJobOffer.component';
import { TimeSelector } from '../components/uiElements/timeSelector.component';
import { EligibleJobOffers } from '../components/jobOffer/eligibleJobOffers.component';
import { JobOfferStrip } from '../components/jobOffer/jobOfferStrip.component';
import { JobOffer } from '../components/jobOffer/jobOffer.component';
import { JobOfferPage } from '../components/jobOffer/jobOfferPage.component';
import { StudentJobOfferPage } from '../components/studentJobOffer/studentJobOfferPage.component';
import { AppliedJobOffers } from '../components/studentJobOffer/appliedJobOffers.component';
import { ChartSelector } from '../components/chart/chartSelector.component';
import { MyRegisteredStudents } from '../components/myRegisteredStudents/myRegisteredStudents.component';
import { DataGrid } from '../components/dataGrid/dataGrid.component';
import { Cell } from '../components/dataGrid/cell.component';
import { Paginator } from '../components/dataGrid/paginator.components';
import { Filter } from '../components/dataGrid/filter.component';
import { StudentLoanAggregations } from '../components/Aggregations/studentLoanAggregations.component';
import { MyOffers } from '../components/offer/myOffers.component';

@NgModule({
  declarations: [
    MyApp,
    Login, LoginAndroid,
    PageHeader, PageHeaderAndroid,
    PageFooter, PageFooterMobile,
    EiLandingPage,
    Signup,
    StudentLandingPage, StudentLandingPageAndroid,
    StudentRegistrationPage,
    GovermentLandingPage,
    MarketplaceLandingPage,
    MemberPage,
    ChangePasswordPage,
    RegisterEIContractPage,
    RegisterGovContractPage,
    MemberUserCreation,
    MemberAccountCreatePage,
    MemberAccountDetailsPage,
    ModalMessage, Accordion, Visualize,
    ListManage,
    CertifiedEI,
    Faculties,
    LoanCategories,
    Association,
    EligibleLoans, LoanType,
    AppliedLoans,
    StudentLoanPage, StudentJobOfferPage,
    LoanTypeStrip,
    TabsLandingPage,
    LoanTypePage,
    StudentSavedLoans, StudentSavedJobOffers, StudentSavedScholarships,
    MemberAccountSendFunds,
    AddOffer, InfoScholarship, InfoLoanType, InfoJobOffer, EligibilityOffer, TermsAndConditionsOffer,
    OrganizationLandingPage,
    RegisterOrganizationContractPage,
    SafePipe, KeysPipe,
    Dashboard,
    ForgotPassword,
    Scholarship, ScholarshipPage, ScholarshipStrip, EligibleScholarships,
    AppliedScholarships, AppliedJobOffers, StudentScholarshipPage,
    StudentScholarshipStrip, StudentJobOfferStrip, StudentLoanStrip,
    StudentMyScholarships, StudentMyJobOffers, StudentMyLoans,
    NumericConstraints, FieldMetadata, DateConstraints, ListConstraints, DynamicFieldValue, MappingConstraints,
    DynamicFieldRepresentation, NumericRepresentation, DateRepresentation, ListRepresentation, FreeTextRepresentation,
    TimeSelector, EligibleJobOffers, JobOfferStrip, JobOffer, JobOfferPage,
    ChartSelector,
    MyRegisteredStudents,
    DataGrid, Cell, Paginator, Filter,
    StudentDetails, StudentLoanAggregations,
    MyOffers,
    TransactionState
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    ReactiveFormsModule,
    MyDatePickerModule,
    CacheModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Login, LoginAndroid,
    PageHeader, PageHeaderAndroid,
    PageFooter, PageFooterMobile,
    EiLandingPage,
    Signup,
    StudentLandingPage, StudentLandingPageAndroid,
    StudentRegistrationPage,
    GovermentLandingPage,
    MarketplaceLandingPage,
    MemberPage,
    ForgotPassword,
    ChangePasswordPage,
    RegisterEIContractPage,
    RegisterGovContractPage,
    MemberUserCreation,
    MemberAccountCreatePage,
    MemberAccountDetailsPage,
    ModalMessage, Accordion, Visualize,
    ListManage,
    CertifiedEI,
    Faculties,
    LoanCategories,
    Association,
    EligibleLoans, LoanType,
    AppliedLoans,
    StudentLoanPage, StudentJobOfferPage,
    LoanTypeStrip,
    TabsLandingPage,
    LoanTypePage,
    StudentSavedLoans, StudentSavedJobOffers, StudentSavedScholarships,
    MemberAccountSendFunds,
    AddOffer, InfoScholarship, InfoLoanType, InfoJobOffer, EligibilityOffer, TermsAndConditionsOffer,
    OrganizationLandingPage,
    RegisterOrganizationContractPage,
    Dashboard,
    Scholarship, ScholarshipPage, ScholarshipStrip, EligibleScholarships,
    StudentScholarshipStrip, StudentJobOfferStrip, StudentLoanStrip,
    StudentMyScholarships, StudentMyJobOffers, StudentMyLoans,
    AppliedScholarships, AppliedJobOffers, StudentScholarshipPage,
    NumericConstraints, FieldMetadata, DateConstraints, ListConstraints, DynamicFieldValue, MappingConstraints,
    DynamicFieldRepresentation, NumericRepresentation, DateRepresentation, ListRepresentation, FreeTextRepresentation,
    TimeSelector, EligibleJobOffers, JobOfferStrip, JobOffer, JobOfferPage,
    ChartSelector,
    MyRegisteredStudents,
    DataGrid, Cell, Paginator, Filter,
    StudentDetails, StudentLoanAggregations,
    MyOffers,
    TransactionState
  ],
  providers: [HTTPServices, PageService, MemberServices, MessageServices]
})
export class AppModule { }