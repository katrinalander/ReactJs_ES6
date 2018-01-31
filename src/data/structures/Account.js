class Account {
    constructor(options = {}){
        this.id = options.id;
        // this.groupId = options.groupId;
        this.accountName = options.accountName;
        // this.accountStatus = options.accountStatus;
        this.posPayStatus = options.posPayStatus;
        // this.posPayProtection = options.posPayProtection;
        this.checkNumber = options.checkNumber;
        this.cutOffTime = options.cutOffTime;
        this.exceptionPending = options.exceptionPending;
    }
    isAccountActive() {
        return true;
    }
}
export default Account;