import BaseViewModel from 'common/BaseViewModel';
import { action, observable } from 'mobx';

import ImagesModel from 'data/models/ImagesModel';

class ImageViewModel extends BaseViewModel {
    static create() {
        const models = {
            imageModel: ImagesModel.create()
        };

        return new ImageViewModel(models);
    }

    constructor(models) {
        super(models);
    }

    /* Images properties */
    @observable image = '';
    @observable error = '';
    @observable isLoading = true;
    @observable zoom = 1;
    @observable isInverted = false;
    @observable rotate = 0;

    rotateStep = 90;
    zoomStep = 0.5;

    @action doZoom(isZoomIn) {
        const { zoomStep } = this;

        this.zoom += isZoomIn * zoomStep;
    }

    @action doInvert() {
        // const { isInverted } = this;
        this.isInverted = !this.isInverted;
    }

    @action doRotate() {
        // const { rotateStep, rotate } = this;

        this.rotate = this.rotate === 270 ? 0 : this.rotate + this.rotateStep;
    }

    @action doReset() {
        // const { zoom, isInverted, rotate } = this;

        this.zoom = 1;
        this.isInverted = false;
        this.rotate = 0;
    }

    getImage(id) {
        this.set('isLoading', true);

        return this.imageModel.getImage(id).then(response => {
            this.set('isLoading', false);

            if(response.success) {
                this.set('image', response.data);
                this.doReset();
            }
            else {
                this.set('error', response.message);
            }
        });
    }
}

export default ImageViewModel;