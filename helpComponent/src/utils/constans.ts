import { getLocaleShortDatePatternString, getLocaleLanguage } from '../utils/utils';

export class Constants {
    public static BACKEND_URL_BASE = 'http://localhost:8080';
    // public static BACKEND_URL_BASE='http://10.0.2.2:8080'; 
    //public static BACKEND_URL_BASE = 'https://gsmp.dh-demo.com';

    public static LOGIN_ERROR_MESAGE = 'The username or password you entered is incorrect.';
    public static SIGNUP_ERROR_MESAGE = 'The username has to be in an email valid format';
    public static SIGNUP_SUCCESS_MESAGE = 'Thank you for registration. You should receive an email with your temporary password';
    public static MAIL_VALIDATION_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public static PASSWORD_VALIDATION_REGEX;

    public static LOCALE = navigator.language; //"en-US"
    public static LOCALE_LANGUAGE_ONLY = getLocaleLanguage(); //"en"
    public static SHORT_DATE_PATTERN = getLocaleShortDatePatternString();

    //Message codes
    public static MESSAGE_ADD_ANOTHER_USER = 'message.add.another.user';
    public static MESSAGE_ADD_ANOTHER_MEMBER = 'message.add.another.member';
    public static MESSAGE_REGISTER_ANOTHER_STUDENT = 'message.register.another.student';
    public static MESSAGE_MUST_CREATE_ACCT = 'message.must.create.acct';
    public static MESSAGE_CONTRACT_ALREADY_EXISTS = 'message.contract.already.exists';
    public static MESSAGE_NOT_ENOUGH_ETHR = 'message.not.enough.ethr';
    public static MESSAGE_SUCCESSFUL_REGISTRATION = 'message.successful.registration';
    public static MESSAGE_PLEASE_TYPE_VALID = 'message.please.type.valid';
    public static MESSAGE_PASSWORD_DONT_MATCH = 'message.password.dont.match';
    public static MESSAGE_ACCT_CREATED_SUCCESSFULLY = 'message.acct.created.successfully';
    public static MESSAGE_MUST_BE_REGISTERED = 'message.must.be.registered';
    public static MESSAGE_CERTIFIED_EI_NOT_DEFINED = 'message.certified.ei.not.defined';
    public static MESSAGE_FACULTIES_NOT_DEFINED = 'message.faculties.not.defined';
    public static MESSAGE_NO_CHANGES_WERE_DONE = 'message.no.changes.were.done';
    public static MESSAGE_SUCCESSFULLY_CHANGED_CERTIFIED_EI = 'message.successfully.changed.certified.ei';
    public static MESSAGE_SUCCESSFULLY_CHANGED_FACULTIES = 'message.successfully.changed.faculties';
    public static MESSAGE_SUCCESSFULLY_CHANGED_LOAN_CATEGORIES = 'message.successfully.changed.loan.categories';
    public static MESSAGE_LOAN_CATEGORIES_NOT_DEFINED = 'message.loan.categories.not.defined';
    public static MESSAGE_DUPLICATE_VALUE = 'message.duplicate.value';
    public static MESSAGE_AT_LEAST_TWO_VALUES_REQUIRED = 'message.at.least.two.values.required';
    public static MESSAGE_SUCCESSFULLY_CHANGED_ASSOCIATIONS = 'message.successfully.changed.associations';
    public static MESSAGE_PLEASE_DEFINE_CATEGORIES = 'message.please.define.categories';
    public static MESSAGE_CLOSE_PAGE = 'message.close.page';
    public static MESSAGE_DUPLICATE_LOAN_CODE = 'message.duplicate.loan.code';
    public static MESSAGE_MEMBER_DID_NOT_PUBLISH_FACULTIES = 'message.member.did.not.publish.faculties';
    public static MESSAGE_REQUEST_SUCCESSFULLY_SENT = 'message.request.successfuly.sent';
    public static MESSAGE_UNKNOWN_ERROR = 'message.unknown.error';
    public static MESSAGE_STUDENT_IS_NOT_ELIGIBLE_FOR_LOAN = 'message.student.not.eligible.for.loan';
    public static MESSAGE_STUDENT_LOAN_REQUEST_APPROVED = 'message.student.loan.request.approved';
    public static MESSAGE_APPROVED = 'message.approved';
    public static MESSAGE_DECLINED = 'message.declined';
    public static MESSAGE_LOANTYPE_NOT_ELIGIBLE = 'message.loantype.not.eligible';
    public static MESSAGE_IS_NOT_VALID = 'message.is.not.valid';
    public static MESSAGE_GOVERNMENT = 'message.government';
    public static MESSAGE_STUDENT = 'message.student';
    public static MESSAGE_APPLY_REQUEST = 'message.apply.request';
    public static MESSAGE_SAVE_DRAFT_REQUEST = 'message.save.draft.request';
    public static MESSAGE_SEND_FUND_SUCCESS = 'message.send.funds.successfuly';
    public static MESSAGE_EMAIL_FORGOT_PASSWORD_SENT_MESSAGE = 'message.email.sent.forgot.password.message';
    public static MESSAGE_EMAIL_FORGOT_PASSWORD_SENT_HEADER = 'message.email.sent.forgot.password.header';
    public static MESSAGE_DUPLICATE_SCHOLARSHIP_NAME = 'message.duplicate.scholarship.name';
    public static MESSAGE_DUPLICATE_JOBOFFER = 'message.duplicate.joboffer.name';
    public static MESSAGE_SCHOLARSHIP_CREATED_SUCCESSFULLY = 'message.scholarship.created.successfully';
    public static MESSAGE_SCHOLARSHIP_SAVED_SUCCESSFULLY = 'message.scholarship.saved.successfully';
    public static MESSAGE_LOANTYPE_CREATED_SUCCESSFULLY = 'message.loantype.created.successfully';
    public static MESSAGE_JOBOFFER_CREATED_SUCCESSFULLY = 'message.joboffer.created.successfully';
    public static MESSAGE_LOANTYPE_SAVED_SUCCESSFULLY = 'message.loantype.saved.successfully';
    public static MESSAGE_JOBOFFER_SAVED_SUCCESSFULLY = 'message.joboffer.saved.successfully';
    public static MESSAGE_FROM_LESS_THAN_TO = "message.from.less.than.to";
    public static MESSAGE_DYNAMIC_FIELDS_NOT_DEFINED = "message.dynamic.fields.not.defined";
    public static MESSAGE_STUDENT_SCHOLARSHIP_REQUEST_APPROVED = 'message.student.scholarship.request.approved';
    public static MESSAGE_STUDENT_JOBOFFER_REQUEST_APPROVED = 'message.student.joboffer.request.approved';
    public static MESSAGE_PASSWORD_CHANGED_SUCCESSFULLY = "message.password.changed.successfully";
    public static MESSAGE_PASSWORD_NEW_DIFFER_FROM_OLD = "message.password.new.differ.from.old";
    public static MESSAGE_SCHOLARSHIP_CLOSE_FOR_SUBMITION_SUCCESSFULLY = "message.scholarship.close.for.submition";
    public static MESSAGE_LOANTYPE_CLOSE_FOR_SUBMITION_SUCCESSFULLY = "message.loantype.close.for.submition";
    public static MESSAGE_JOBOFFER_CLOSE_FOR_SUBMITION_SUCCESSFULLY = "message.joboffer.close.for.submition";

    //Label codes
    public static LABEL_CERTIFIED_EI = 'label.certified.ei';
    public static LABEL_FACULTIES = 'label.faculties';
    public static LABEL_LOAN_CATEGORIES = 'label.loan.categories';

    //Button captions
    public static BUTTON_CAPTION_OK = 'OK';
    public static BUTTON_CAPTION_YES = 'Yes';
    public static BUTTON_CAPTION_NO = 'No';

    //Cache names
    public static ELIGIBLE_LOANS_CACHE = "ELIGIBLE_LOANS";
    public static ELIGIBLE_JOBOFFER_CACHE = "ELIGIBLE_JOBOFFER";
    public static ELIGIBLE_SCHOLARSHIP_CACHE = "ELIGIBLE_SCHOLARSHIP";
    


    public static MEMBER_TYPES = [
        { "type": "gov", "desc": "Government" },
        { "type": "ei", "desc": "Educational institution" },
        { "type": "organization", "desc": "Organization" },
        { "type": "marketplace", "desc": "Marketplace" }
    ];

    static getMemberTypeDescription(memberType: string): string {
        for (let entry of Constants.MEMBER_TYPES) {
            if (memberType == entry.type) {
                return entry.desc;
            }
        }
        return '';
    }
}

export enum UserType {
    Student = <any>"student",
    EIUser = <any>"eiuser",
    Government = <any>"government",
    Marketplace = <any>"marketplace",
    Organization = <any>"organization"
}
