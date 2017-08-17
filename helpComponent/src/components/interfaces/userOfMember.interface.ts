export interface UserOfMemberInterface {
    registeredByDHAdmin: string; //Name of DH admin that registers a new user
    status: string;
    memberType: string; //EI or GOV
    memberName: string; //i.e. University of Toronto
    familyName: string;
    givenName: string;
    email: string;
    role: string;
}