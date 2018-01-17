import { getRequest } from 'data/services/requestService';

const IMG_SERVICE_URL = '/image';

const ImagesServices = {
    getImage(id) {

        const payload = {
            imageId: id
        };

        return getRequest(IMG_SERVICE_URL, payload);
    }
};

export default ImagesServices;