import { FieldMetadataValueInterface } from './fieldMetadata.interface';
import { ViewedTypeEnum } from './types.interface';
import { OfferInterface, StudentOfferInterface } from './offer.interface';

export interface ScholarshipInterface extends OfferInterface {
    info: InfoScholarshipInterface,
    organization?: string
}

export interface InfoScholarshipInterface {
    status: string,
    createDate: Date,
    name: string,
    origName?: string,
    description: string,
    openDate: Date,
    publishResultDate: Date,
    applicationDeadline: Date,
    maxAmount: number,
    ccy: string,
    numberOfAwards: number
}

export interface StudentScholarshipInterface extends StudentOfferInterface {
    scholarshipName: string,
    organizationName: string,
    contractAddress: string,
    applyDate: Date,
    scholarship: ScholarshipInterface
}