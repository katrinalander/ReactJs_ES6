import { getRequest, putRequest, deleteRequest, postRequest } from 'data/services/requestService';
import fileFormatTypes from 'constants/fileFormatTypes';

const FILEFORMAT_SERVICE_URL = '/reconFileFormats';

const FileFormatService = {
    getFileFormats() {
        return getRequest(FILEFORMAT_SERVICE_URL, {});
    },

    getFileFormat(id) {
        return getRequest(`${FILEFORMAT_SERVICE_URL}/${id}`,{});
    },

    saveFileFormat(format) {
        const payload = {
            reconFileFormats: {
                id: format.id,
                fileFormatName: format.fileFormatName,
                isDefaultFormat: format.isDefaultFormat ? 'Y' : 'N',
                fileType: format.fileFormatType,
                fieldSeparator: format.fieldSeparator,
                sampleDataLine: format.sampleDataLine,
                helpContent: format.helpContent,
                fieldDelimiter: format.fieldDelimiter
            }
        };

        payload.reconFileFormats.fileFormatFields = format.fileFormatFields.map(field => {
            return {
                id: field.id,
                fieldName: field.fieldName,
                fieldOrder: format.fieldFormatType === fileFormatTypes.FIXED ? field.startPosition : field.fieldOrder,
                endPosition: format.fileFormatType === fileFormatTypes.FIXED ? field.finishPosition : null,
                dateFormats: field.dateFormats,
                decimal: field.decimal,
                dbFieldName: field.dbFieldName,
                dbFieldType: field.dbFieldType,
                transInd: field.transInd,
                mask: field.mask,
                justify: field.justify,
                length:field.length,
                isUploadedTime: field.isUploadedTime,
                isRequired: field.isRequired ? 'Y' : 'N'
            };
        });

        return postRequest(FILEFORMAT_SERVICE_URL, payload);
    },

    editFileFormat(format) {
        const payload = {
            reconFileFormats: {
                id: format.id,
                fileFormatName: format.fileFormatName,
                isDefaultFormat: format.isDefaultFormat ? 'Y' : 'N',
                fileType: format.fileFormatType,
                fieldSeparator: format.fieldSeparator,
                sampleDataLine: format.sampleDataLine,
                helpContent: format.helpContent,
                fieldDelimiter: format.fieldDelimiter
            }
        };

        payload.reconFileFormats.fileFormatFields = format.fileFormatFields.map(field => {
            return {
                id: field.id,
                fieldName: field.fieldName,
                fieldOrder: format.fieldFormatType === fileFormatTypes.FIXED ? field.startPosition : field.fieldOrder,
                endPosition: format.fileFormatType === fileFormatTypes.FIXED ? field.finishPosition : null,
                dateFormats: field.dateFormats,
                decimal: field.decimal,
                dbFieldName: field.dbFieldName,
                dbFieldType: field.dbFieldType,
                transInd: field.transInd,
                mask: field.mask,
                justify: field.justify,
                length:field.length,
                isUploadedTime: field.isUploadedTime,
                isRequired: field.isRequired ? 'Y' : 'N'
            };
        });

        return putRequest(`${FILEFORMAT_SERVICE_URL}/${format.id}`,payload);
    },

    deleteFileFormat(id) {
        return deleteRequest(FILEFORMAT_SERVICE_URL, id);
    }
};

export default FileFormatService;