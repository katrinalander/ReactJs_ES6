import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import autobind from 'autobind-decorator';

import Button from 'components/Button';

import classNames from 'utils/classNames';
import styles from './Modal.scss';
import Keys from 'constants/keys';

@observer
class Modal extends Component {
    firstButton = null;

    static propTypes = {
        buttons: PropTypes.arrayOf(PropTypes.node).isRequired,
        classNames: PropTypes.string,
        message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        target: PropTypes.object,
        title: PropTypes.string,
        visible: PropTypes.bool,
        onCloseRequest: PropTypes.func
    }

    static defaultProps = {
        visible: false
    }

    componentDidUpdate(prevProps) {
        const { target } = this.props;
        const prevVisible = prevProps.visible;
        const nextVisible = this.props.visible;

        if(nextVisible !== prevVisible) {
            if(nextVisible) {
                document.addEventListener('keydown',this.handleEscClose);
                this.buttonAutoFocus();
            }
            else {
                document.removeEventListener('keydown',this.handleEscClose);
                target && target.focus();
            }
        }
    }

    @autobind handleEscClose(event) {
        const { onCloseRequest } = this.props;
        if(event.keyCode === Keys.ESC) {
            onCloseRequest && onCloseRequest();
        }
    }

    @autobind buttonAutoFocus() {
        if(this.firstButton) {
            this.firstButton.focus();
        }
    }

    renderTitle() {
        const { title } = this.props;
        return (
            <h1 className={styles.title}>
                { title }
            </h1>
        );
    }

    renderMessage() {
        const { message } = this.props;
        return (
            <div className={styles.message}>
                { message }
            </div>
        );
    }

    renderButton() {
        const { buttons } = this.props;
        const content = buttons.map((button,index) => {
            const { children, className } = button.props;
            const cls = classNames([
                styles.button,
                className
            ]);

            return (
                <Button
                    {...button.props}
                    ref={element => {
                        if(index === 0) {
                            this.firstButton = element;
                        }
                    }}
                    tabIndex="-1"
                    className={cls}
                    key={index}
                >
                    { children }
                </Button>
            );
        });

        return (
            <div className={styles.buttonContainer}>
                { content }
            </div>
        );
    }

    render() {
        const { className, visible } = this.props;
        const cls = classNames([
            styles.container,
            className
        ]);
        const title = this.renderTitle();
        const message = this.renderMessage();
        const buttons = this.renderButton();

        return visible ? (
            <div className={cls}>
                <div className={styles.content}>
                    { title }
                    { message }
                    { buttons }
                </div>
            </div>
        ) : null;
    }
}

export default Modal;
