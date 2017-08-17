import { FieldMetadataValueInterface } from './fieldMetadata.interface';
import { ViewedTypeEnum } from './types.interface';
import { OfferInterface, StudentOfferInterface } from './offer.interface';
import { TimeInterface } from './dateTime.interface';

export interface JobOfferInterface extends OfferInterface {
    info: InfoJobOfferInterface,
    organization?: string
}

export interface InfoJobOfferInterface {
    status: string,
    createDate: Date,
    name: string,
    origName?: string,
    jobBrief: string,
    responsibilities: string,
    requirements: string,
    isPartial: boolean,
    weeklyWorkingHours?: number,
    workingHoursFrom?: TimeInterface,
    workingHoursTo?: TimeInterface,
    limitedPeriodFromDate?: Date,
    limitedPeriodToDate?: Date,
    workPlace: string
}

export interface StudentJobOfferInterface extends StudentOfferInterface {
    jobOfferName: string,
    contractAddress: string,
    organizationName: string,
    applyDate: Date,
    jobOffer: JobOfferInterface
}