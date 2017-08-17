import { ViewedTypeEnum } from './types.interface';
import { OfferInterface, StudentOfferInterface } from './offer.interface';
import { FieldMetadataValueInterface } from './fieldMetadata.interface';

export interface LoanTypeInterface extends OfferInterface {
    info: InfoLoanTypeInterface
}

export interface InfoLoanTypeInterface {
    status: string,
    createDate: Date,
    loanCode: string,
    name: string,
    origName?: string,
    description: string,
    type: string | ItemInterface,
    openDate: Date,
    deadlineDate: Date,
    amount: number,
    categories: ItemInterface[],  //categories, [-1, "ALL"] – for ALL
    residencies: ItemInterface[],
    percentOfStudiesFrom: number,
    percentOfStudiesTo: number,
    currency?: string,
    govId?: string,
}

export interface StudentLoanInterface extends StudentOfferInterface {
    loanApplyDate: Date,
    studentName: string,
    educationalInstitution: string,
    faculty: ItemInterface,
    studentLoanId: string,
    loanType: LoanTypeInterface
}

export interface LoanTypeMetaDataInterface {
    currency: string,
    categories: ItemInterface[],
    residencies: ItemInterface[],
    types: ItemInterface[]
}

export interface ItemInterface {
    name: string,
    code: string
}