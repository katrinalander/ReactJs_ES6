import shortid from 'shortid';

import getDateTimeString from 'utils/getDateTimeString';

class UploadSummary {
    constructor(options = {}) {
        this.fileName = options.fileName || '';
        this.id = options.id || shortid.generate();
        this.failedRecords = options.failedRecords || 0;
        this.successfulRecords = options.successfulRecords || 0;
        this.totalRecords = options.totalRecords || 0;
        this.uploadDate = getDateTimeString(options.uploadDate) || '';
        this.uploadErrorCode = options.uploadErrorCode || '';
        this.uploadErrorMessage = options.uploadErrorMessage || '';

        this.checksCancelDetails = {};
        this.checksCancelDetails.failedChecks = options.checksCancelDetails.failedChecks || 0;
        this.checksCancelDetails.successfulChecks = options.checksCancelDetails.successfulChecks || 0;
        this.checksCancelDetails.totalAmount = options.checksCancelDetails.totalAmount || 0;
        this.checksCancelDetails.totalChecks = options.checksCancelDetails.totalChecks || 0;

        this.checksIssueDetails = {};
        this.checksIssueDetails.failedChecks = options.checksIssueDetails.failedChecks || 0;
        this.checksIssueDetails.successfulChecks = options.checksIssueDetails.successfulChecks || 0;
        this.checksIssueDetails.totalAmount = options.checksIssueDetails.totalAmount || 0;
        this.checksIssueDetails.totalChecks = options.checksIssueDetails.totalChecks || 0;
    }
}

export default UploadSummary;