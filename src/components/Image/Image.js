import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import classNames from 'utils/classNames';
import styles from './Image.scss';
import ImageInstruments from "./ImageInstruments/ImageInstruments";

const ANIMATION_DELAY = 50;
const NO_IMAGE_CONTENT = '/something';///'/aY2FuYWNvcGVnZGwuY29tL2ltYWdlcy9leGFtcGxlL2V4YW1wbGUtMS5qcGc=';

@observer
class Image extends Component {
    static propTypes = {
        alignment: PropTypes.oneOf(['horizontal', 'vertical']),
        id: PropTypes.string.isRequired,
        className: PropTypes.string,
        viewModel: PropTypes.object.isRequired
    };

    static defaultProps = {
        alignment: 'horizontal'
    };

    elementImage = null;
    elementImageWrapper = null;

    componentWillUpdate(nextProps) {
        const { id, viewModel } = nextProps;

        if (this.shouldImageUpdate(nextProps)) {
            viewModel.getImage(id);
        }
    }

    componentDidMount() {
        const { id, viewModel } = this.props;

        viewModel.getImage(id);
    }

    shouldImageUpdate(nextProps) {
        const currentImg = this.props.id;
        const nextImg = nextProps.id;

        const output = (
            currentImg !== nextImg ||
            this.props.alignment !== nextProps.alignment ||
            this.props.className !== nextProps.className
        );

        return output;
    }

    doAnimatedZoom(widthStep, heightStep) {
        const elementImg = this.elementImage;
        const elementImgWrapper = this.elementImageWrapper;

        let animationStep = 0;
        let animationInterval = setInterval(() => {
            const width = this.elementImage.style.width || 100;
            const height = this.elementImage.style.height || 100;

            elementImg.style.width = (parseInt(width, 10) + widthStep * 100) + '%';
            elementImg.style.height = (parseInt(height, 10) + heightStep * 100) + '%';

            elementImgWrapper.scrollLeft = elementImg.clientWidth;

            animationStep++;

            if (animationStep === ANIMATION_DELAY) {
                clearInterval(animationInterval);
                animationInterval = null;
            }
        },1);
    }

    doInvert() {
        const { elementImage } = this;
        const canvas = document.createElement('canvas');
        const image = elementImage;

        let x = 0;
        let y = 0;

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const context = canvas.getContext('2d');
        context.drawImage(image,x,y);

        const contextData = context.getImageData(x,y,image.naturalWidth,image.naturalHeight);
        const imageData = contextData.data;

        for (let i=0; i < imageData.length; i += 4) {
            imageData[i] = 255 - imageData[i]; //red
            imageData[i + 1] = 255 - imageData[i + 1]; //green
            imageData[i + 2] = 255 - imageData[i + 2]; //blue
        }

        //overwrite original image
        context.putImageData(contextData,x,y);

        const invertedImageData = canvas.toDataURL();
        elementImage.src = invertedImageData;
    }

    handleClickZoom(isZoomIn) {
        const { zoomStep } = this.props.viewModel;

        const widthStep = isZoomIn * zoomStep / ANIMATION_DELAY;
        const heightStep = isZoomIn * zoomStep / ANIMATION_DELAY;

        this.doAnimatedZoom(widthStep,heightStep);
    }

    handleReset() {
        const { viewModel } = this.props;
        const { zoom } = viewModel;

        const widthStep = (1 - zoom) / ANIMATION_DELAY;
        const heightStep = (1 - zoom) / ANIMATION_DELAY;

        this.doAnimatedZoom(widthStep,heightStep);

        if (viewModel.isInverted) {
            this.doInvert();
        }
    }

    handleInvert() {
        this.doInvert();
    }

    handlePrint(image) {
        const html = '<!DOCTYPE html>\n' +
                '<html>\n' +
                '<body>\n' +
                `<img src=${this.getImageData(image)} />` +
                '</body>\n' +
                '</html>';

        const printWindow = window.open('','','width=800, height=500');
        const printDocument = printWindow.document.open();
        printDocument.write(html);
        printDocument.close();
        printWindow.print();
    }

    getImageData(image) {
        return image ? `data:image/jpeg;base64,` : NO_IMAGE_CONTENT;
    }

    renderInstruments (image) {
        const { viewModel } = this.props;

        return (
            <ImageInstruments
                viewModel={viewModel}
                onInvert={() => this.handleInvert()}
                onPrint={() => this.handlePrint()}
                onZoom={(isZoomIn) => this.handleClickZoom(isZoomIn)}
                onReset={() => this.handleReset()}
            />
        );
    }

    renderImage(image) {
        const { alignment, viewModel } = this.props;
        const { isInverted, rotate } = viewModel;

        const cls = classNames([
            styles.imageContainer,
            styles[alignment]
        ]);

        const imageCls = classNames([
            isInverted ? styles.imageInverted : '',
            styles[`imageRotated${rotate}`]
        ]);

        const instruments = this.renderInstruments(image);

        console.log("getImageData: "+this.getImageData(image));

        return (
            <div className={cls}>
                <div className={styles.instruments}>
                    { instruments }
                </div>
                <div className={styles.elementImageWrapper}>
                    <div ref={element => (this.elementImageWrapper = element)} className={styles.elementImageWrapperScroll}>
                        <img ref={element => (this.elementImage) = element} src={this.getImageData(image)} className={imageCls} />
                    </div>
                </div>
            </div>
        );
    }

    renderError(error) {
        return (
            <p>{ error }</p>
        );
    }

    render() {
        const { viewModel, className } = this.props;
        const { isLoading, image, error } = viewModel;

        console.log('image',image);

        const cls = classNames([
            styles.container,
            className
        ]);

        const content = error ? this.renderError(error) : this.renderImage(image);

        return (
            <div className={cls}>
                { content }
            </div>
        );
    }
}

export default Image;