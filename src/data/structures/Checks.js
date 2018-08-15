import shortid from 'shortid';

import getDateTimeString from 'utils/getDateTimeString';
import getTimeString from 'utils/getTimeString';

class Check {
    constructor(options = {}) {
        this.checkType = options.checkType || '';
        this.accountName = options.accountName || '';
        this.accountNumber = options.accountNumber || '';
        this.approvedTime = getTimeString(options.approvedTime) || '';
        this.id = options.id || shortid.generate();
        this.paidDate = getDateTimeString(options.paidDate) || '';
    }
}

export default Check;