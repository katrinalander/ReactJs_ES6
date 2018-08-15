import getDateTimeString from 'utils/getDateTimeString';
import getTimeString from 'utils/getTimeString';

class Account {
    constructor(options = {}){
        this.id = options.id;
        // this.groupId = options.groupId;
        this.accountName = options.accountName;
        // this.accountStatus = options.accountStatus;
        this.posPayStatus = options.posPayStatus;
        // this.posPayProtection = options.posPayProtection;
        this.checkNumber = options.checkNumber;
        this.cutOffTime = getTimeString(options.cutOffTime) || '';
        this.exceptionPending = options.exceptionPending;
        this.activeDate = getDateTimeString(options.activeDate) || '';
    }
    isAccountActive() {
        return true;
    }
    isAccountHasStatus() {
        return true;
    }
}
export default Account;