import { postRequest, putRequest } from 'data/services/requestService';

const UPLOAD_SERVICE_URL = '/reconFileUpload';

const UploadService = {
    uploadFile(file) {
        const fileData = file.file;

        const payload = new FormData();
        payload.append('fileId',fileFormatId);
        payload.append('file', fileData, fileData.name);

        return postRequest(UPLOAD_SERVICE_URL, payload);
    },

    confirmFile(fileId, action) {
        return putRequest(`${UPLOAD_SERVICE_URL}`,{
            fileUpload: fileId,
            action: action
        });
    }
};

export default UploadService;