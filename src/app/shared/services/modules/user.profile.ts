import { UserPermission } from "./user.permission";

export class UserProfile {
  constructor(
    public acctId = '',
    public contactName = '',
    public custIndex = '',
    public custName = '',
    public idAccount = 0,
    public normalPriceListId = '',
    public specialPriceListId = '',
    // public id =  '',
    // public email = '',
    // public given_Name = '',
    // public family_Name = '',
    // public preferred_username = '',
    // public addressType = 'home',
    // public addressLine1 = '',
    // public addressLine2 = '',
    // public city = '',
    // public county = '',
    // public postCode = '',
    // public country = '',
    // public userPermissions: UserPermission[] = []) { }
    // public subject = '',
    // public subscriptionLevel = ''
    ){}
}
