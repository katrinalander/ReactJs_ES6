import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import Icon from 'components/Icon';

import classNames from '../../../utils/classNames';
import styles from './ImageInstruments.scss';

@observer
class ImageInstruments extends Component {
    static propTypes = {
        className: PropTypes.string,
        viewModel: PropTypes.object.isRequired,
        onInvert: PropTypes.func,
        onPrint: PropTypes.func,
        onReset: PropTypes.func,
        onRotate: PropTypes.func,
        onZoom: PropTypes.func
    }

    handleClickZoom(isZoomIn) {
        const { side, viewModel, onZoom } = this.props;

        viewModel.doZoom(isZoomIn);

        if (onZoom) {
            onZoom(isZoomIn);
        }
    }

    handleClickRotate() {
        const { viewModel, onRotate } = this.props;

        viewModel.doRotate();

        if(onRotate) {
            onRotate();
        }
    }

    handleClickInvert() {
        const { viewModel, onInvert } = this.props;

        viewModel.doInvert();

        if(onInvert) {
            onInvert();
        }
    }

    handleClickPrint() {
        const { onPrint } = this.props;

        if (onPrint) {
            onPrint();
        }
    }

    handleReset() {
        const { onReset, viewModel } = this.props;

        if(onReset) {
            onReset();
        }

        viewModel.doReset();
    }

    renderRotate() {
        return (
            <button className={styles.instrumentButton} onClick={() => this.handleClickRotate()}>
                rotate
            </button>
        );
    }

    renderInvert() {
        return (
            <button className={styles.instrumentButton} onClick={() => this.handleClickInvert()}>
                invert color
            </button>
        );
    }

    renderReset() {
        return (
            <button className={styles.instrumentButton} onClick={() => this.handleReset()}>
                reset
            </button>
        );
    }

    renderPrint() {
        return (
            <Icon type="printer" className={styles.instrumentIcon} onClick={() => this.handleClickPrint()}/>
        );
    }

    renderSeparator() {
        return (
            <span className={styles.separator}>|</span>
        );
    }

    render() {
        const { className, viewModel } = this.props;
        const { zoom } = viewModel;

        const cls = classNames([
            styles.instruments,
            className
        ]);

        const rotate = this.renderRotate();
        const invert = this.renderInvert();
        const separator = this.renderSeparator();

        const zoomIn = zoom < 5 ? (
            <Icon type="zoom-in" className={styles.instrumentIcon} onClick={() => this.handleClickZoom(1)} />
        ) : (
            <Icon type="zoom-in" className={styles.instrumentIcon} disabled={true}/>
        );

        const zoomOut = zoom > 1 ? (
            <Icon type="zoom-out" className={styles.instrumentIcon} onClick={() => this.handleClickZoom(-1)} />
        ) : (
            <Icon type="zoom-out" className={styles.instrumentIcon} disabled={true}/>
        );

        const reset = this.renderReset();
        const print = this.renderPrint();

        return (
            <div className={cls}>
                <div className={styles.instrumentActions}>
                    <span className={styles.instrumentActionsContainer}>
                        { rotate }
                        { separator }
                        { invert }
                        { separator }
                        { reset }
                    </span>
                    { zoomIn }
                    { zoomOut }
                    { print }
                </div>
            </div>
        );
    }
}

export default ImageInstruments;