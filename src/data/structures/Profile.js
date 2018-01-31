import Account from 'data/structures/Account';

class Profile {
    constructor(options = {}){
        this.approvedCount = options.approvedCount || 0;

        if(options.exceptionViewList && options.exceptionViewList.length){
            this.accounts = options.exceptionViewList.map(item => new Account(item));
        }
        else {
            this.accounts = [];
        }

        this.id = options.id || 0;
        this.pendingCount = options.pendingCount || 0;
        this.reviewedCount = options.reviewedCount || 0;
        this.reviewingCount = options.reviewingCount || 0;
        this.totalExceptionCount = options.totalExceptionCount || 0;
    }
}
export default Profile;