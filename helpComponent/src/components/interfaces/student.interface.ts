import {ItemInterface} from './loan.interface';

export interface StudentInterface {
    status: string,
    familyName: string,
    givenName: string,
    registrationDate: Date,
    universityName: string,
    idType: string,
    idNumber: string,
    faculty: ItemInterface,
    address1?: string,
    address2?: string,
    levelOfStudy?: string,
    semester?: string,
    year?: number,
    percentOfStudies?: number,
    city?: string,
    stateOrProvince?: string,
    postalCode?: string,
    phoneNumber?: string,
    email: string,
    password?: string,
    eiId?: string,
    draft?: boolean
}