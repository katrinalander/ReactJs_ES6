import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import classNames from 'utils/classNames';
import styles from './Image.scss';
import ImageInstruments from "./ImageInstruments/ImageInstruments";

const ANIMATION_DELAY = 50;
const NO_IMAGE_CONTENT = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAETARMDAREAAhEBAxEB/8QAHQABAAIDAQEBAQAAAAAAAAAAAAYHBAUIAgMBCf/EAFMQAAEDAwIDAwYGDgQMBwAAAAEAAgMEBREGBxITIQgxQRQiUWFxgRUydJGhsRYjMzY3QlJicoKEkrLBs7TC4RgkJjQ4RlNVY3aixBd1k5TS0+L/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/qmgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDHra+C3U7p6mQRRN73FBr4NXWepdhldGP0wWfWAg2EFwpan7jUwy/oSA/UgyEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBBDNzqrlW2kh/2khd8w/vQVxxhAEmO7ogyoLxWUoAhq54h6GSEINjBri8wNDRWucB+WxrvpIyg2MG5lyjAEkNPL6SWkH6Cg2NPum04E1AR645P5EINlT7k2mUgSCeD1uZkfQSg2VNrGzVRwyviaf+Jln1gINrDPHURNkikbLG7qHsOQfeg+iAgICAgICAgICAgICAgICAgICAgICAgICCtt1aw+XUNP4MjMnznH9lBG9K0TLrf6Omlbxxvdl7c4yACT9SCyKnb6zTtwyB8B9LJHH6yUGrqNraZw+01srT+e0EINbNtdXjJjq4Hep3EP5INbLt7fIyQ2nZIPS2Vo+shBrqjTV3pXESW+o6fksLh84QYE0E9M4tmhki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';

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
        return image ? `data:image/jpeg;base64,`+image : NO_IMAGE_CONTENT;
    }

    renderInstruments (image) {
        const { viewModel } = this.props;

        return (
            <ImageInstruments
                viewModel={viewModel}
                onInvert={() => this.handleInvert()}
                onPrint={() => this.handlePrint(image)}
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
            styles[`imageRotated${rotate}`],
            isInverted ? styles.imageInverted : ''
        ]);

        const instruments = this.renderInstruments(image);

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

        const cls = classNames([
            styles.container,
            className
        ]);

        const content = error ? this.renderError(error) : this.renderImage(image.image);

        return (
            <div className={cls}>
                { content }
            </div>
        );
    }
}

export default Image;