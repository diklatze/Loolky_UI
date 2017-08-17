import { FieldMetadataValueInterface, FieldTypeEnum } from './fieldMetadata.interface';
import { ViewedTypeEnum } from './types.interface';
import { getInnerObjectProperty, isNullOrUndefined } from '../../utils/utils';

export enum OfferType {
    scholarship = <any>"scholarship",
    loanType = <any>"loanType",
    jobOffer = <any>"jobOffer"
}

export enum OfferStatus {
    pending = <any>"Pending",
    approved = <any>"Approved",
    declined = <any>"Declined"
}

export enum OfferTransactionState {
    new = <any>"New",
    published = <any>"Published",
    failed = <any>"Failed"
}

//Defines the name of ID and orig ID for each OfferType
export let idFieldNameByOfferType = {
    [OfferType.scholarship]: { idFieldName: 'name', origIdFieldName: 'origName' },
    [OfferType.loanType]: { idFieldName: 'loanCode', origIdFieldName: 'origLoanCode' },
    [OfferType.jobOffer]: { idFieldName: 'name', origIdFieldName: 'origName' }
};

export interface OfferInterface {
    contractAddress: string,
    eligibility: EligibilityOfferInterface,
    requiredInfo: RequiredInfoOfferInterface,
    viewed?: ViewedTypeEnum,
    saveDate?: Date,
    saved?: boolean,
    organization?: string,
    transactionState?: TransactionStateInterface
}

export interface TransactionStateInterface {
    state: OfferTransactionState,
    description?: string
}

export interface EligibilityOfferInterface {
    studiesType: string;
}

export interface RequiredInfoOfferInterface {
    dynamicFields: FieldMetadataValueInterface[];
}

export interface StudentOfferInterface {
    status: string,
    studentId: string,
    viewed?: ViewedTypeEnum,
    updateDate: Date,
    transactionState?: TransactionStateInterface,
    dynamicFields: FieldMetadataValueInterface[]
}

export function isContainsNonMappingDynamicFields(offer: OfferInterface): boolean {
    let arrLength: number = getInnerObjectProperty(offer, 'requiredInfo.dynamicFields.length');
    if (isNullOrUndefined(arrLength) || arrLength == 0) {
        return false;
    }

    for (let i = 0; i < arrLength; i++) {
        if (offer.requiredInfo.dynamicFields[i].constraints.type != FieldTypeEnum.mapping) {
            return true;
        }
    }

    return false;
}