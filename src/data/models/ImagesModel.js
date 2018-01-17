import BaseModel from 'common/BaseModel';

import ImagesService from 'data/api/ImagesService';

import getErrorMessage from 'utils/getErrorMessage';

class ImagesModel extends BaseModel {
    static create() {
        const model = new ImagesModel(ImagesService);

        return model;
    }

    storage = {};

    serializeData(data) {
        return { ...data };
    }

    getImage(id) {
        console.log("!!!");
        return this.api.getImage(id).then(
            response => {
                this.storage = this.serializeData(response.data.image);
                return {
                    success: true,
                    data: this.storage
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

export default ImagesModel;