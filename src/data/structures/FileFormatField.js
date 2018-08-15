import shortid from 'shortid';

import checkAmountTypes from 'constants/checkAmountTypes';

class FileFormatField {
    constructor(options = {}, type) {
        this.id = options.id || shortid.generate();
        this.fieldName = options.fieldName || '';
        this.fieldOrder = options.fieldOrder || '';
        this.dateFormats = options.dateFormats || '';
        this.decimals = options.decimals || CheckAmountTypes.NO_IMPLIED_DECIMAL.code;
        this.dbFieldName = options.dbFieldName || '';
        this.dbFieldType = options.dbFieldType || '';
        this.predefinedJunification = options.predefinedJunification || '';
        this.mask = options.mask || 'MM/DD/YY';
        this.justify = options.justify || '';
        this.length = options.length || '';
        this.isUploadedTime = options.isUploadedTime || '';
        this.isRequired = options.isRequired === 'Y';
        this.isValid = options.isValid || true;
        this.startPosition = options.startPosition ? options.startPosition : options.fieldOrder ? options.fieldOrder : 0;
        this.finishPosition = options.finishPosition ? options.finishPosition : options.endPosition ? options.endPosition : 0;
        this.startEndPosition = options.startEndPosition || 0;
        this.sample = options.sample || '';
        this.fileFormatType = type;
        this.transInd = options.transInd || '';
    }

    setFieldOrder(value) {
        const order = parseInt(value, 10);
        this.fieldOrder = isNaN(order) ? 0 : order;
    }
}

export default FileFormatField;