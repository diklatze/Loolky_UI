import { ScholarshipInterface, InfoScholarshipInterface } from '../interfaces/scholarship.interface';
import { EligibilityOfferInterface, RequiredInfoOfferInterface } from '../interfaces/offer.interface';
import { LoanTypeInterface, InfoLoanTypeInterface } from '../interfaces/loan.interface';
import { JobOfferInterface, InfoJobOfferInterface } from '../interfaces/jobOffer.interface';
import { TransactionStateInterface } from '../interfaces/offer.interface';

export declare abstract class FormComponent {
    abstract isValid(): boolean;
    abstract isDirty(): boolean;
    abstract clearFormData(): void;
    abstract getFormData(): ScholarshipInterface | LoanTypeInterface | JobOfferInterface | InfoLoanTypeInterface | InfoScholarshipInterface | InfoJobOfferInterface | EligibilityOfferInterface | RequiredInfoOfferInterface;
    abstract setData(data: ScholarshipInterface | LoanTypeInterface | JobOfferInterface | InfoLoanTypeInterface | InfoScholarshipInterface | InfoJobOfferInterface | EligibilityOfferInterface | RequiredInfoOfferInterface, isReadOnlyMode: boolean, transactionState?: TransactionStateInterface): void;
}