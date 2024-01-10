export interface User
{
    id: string;
    name: string;
    email: string;
    mobile: string;
    gender?: string;
    dob?: Date;
    affiliateUserName: string;
    avatar?: string;
    status?: string;
    roleId?: number;
    prefix?: string;
    redirectProfile?: boolean;
    roles?: any;
    profileVerified?: number;
    profileRedirectionObj?: any;
}
