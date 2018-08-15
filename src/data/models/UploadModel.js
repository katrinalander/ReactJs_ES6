import BaseModel from 'common/BaseModel';

import Upload from 'data/structures/Upload';
import UploadService from 'data/api/UploadService';

import getErrorMessage from 'utils/getErrorMessage';

class UploadModel extends BaseModel {
    static create() {
        const model = new UploadModel(UploadService);

        return model;
    }

    storage = {};

    serializeData(data) {
        return new Upload(data);
    }

    uploadFile(file) {
        return this.api.uploadFile(file).then(
            response => {
                if (response.data.fileUpload && !response.data.fileUpload.uploadErrorCode) {
                    this.storage = this.serializeData(response.data.fileUpload);

                    return {
                        success: true,
                        data: this.storage
                    };
                }

                this.storage = {};

                return {
                    success: false,
                    message: response.data.fileUpload.uploadErrorMessage
                };
            },

            error => {
                return {
                    success: false,
                    message: getErrorMessage(error)
                };
            }
        );
    }

    saveFile(fileId) {
        return this.api.confirmFile(fileId, 'submit').then(
            () => {
                return {
                    success: true
                };
            },
            error => {
                return {
                    success: false,
                    message: getErrorMessage(error)
                };
            }
        );
    }
}

export default UploadModel;