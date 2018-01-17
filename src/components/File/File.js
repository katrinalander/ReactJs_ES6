import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import Alert from 'components/Alert';
import Button from 'components/Button';
import ToolTip from 'components/ToolTip';

import classNames from 'utils/classNames';
import styles from './File.scss';

const NO_FILE = 'No file choosen.';

const ErrorMessages = {
    REQUIRED: 'This field is required.'
};

@observer
class File extends Component {
    element = null;
    file = null;
    isActive = false;

    @observable error = '';
    @observable fileName = NO_FILE;
    @observable isValid = true;
    @observable isErrorVisible = false;
    @observable errorMessage = '';

    static propTypes = {
        classNames: PropTypes.string,
        error: PropTypes.string,
        file: PropTypes.object,
        id: PropTypes.string,
        isRequired: PropTypes.bool,
        label: PropTypes.string,
        onChange: PropTypes.func
    }

    componentWillReceiveProps(nextProps) {
        this.error = nextProps.error;
        this.isValid = this.error === '';
        this.file = nextProps.file || null;

        if(this.file) {
            this.fileName = this.file.name;
        }
    }

    static defaultProps = {
        isRequired: false
    }

    @autobind handleClick() {
       this.element.click();
    }

    @autobind handleBlur() {
        this.isActive = false;
        this.isErrorVisible = false;
    }

    @autobind handleFocus() {
        this.isActive = true;
        this.isErrorVisible = !this.isValid && (this.errorMessage !== '');
    }

    @autobind handleChange(event) {
        const { onChange } = this.props;

        if(this.element.files.length) {
            this.file = this.element.files[0];
            this.fileName = this.file.name;
        }
        else {
            this.file = null;
            this.fileName = NO_FILE;
        }

        this.isValid = this.validate();

        if(onChange) {
            onChange(event, this.isValid, this.file);
        }
    }

    reset() {
        this.isValid = true;
        this.fileName = NO_FILE;
        thi.element.files = null;
    }

    validate() {
        const { error, file } = this;
        const { isRequired } = this.props;

        if(error !== '' && !file) {
            return false;
        }

        if(isRequired && !file) {
            this.errorMessage = ErrorMessages.REQUIRED;
            return false;
        }

        this.errorMessage = '';
        return true;
    }

    renderContent() {
        const { error, fileName } = this;

        return error ? (
            <Alert className={styles.fileAlert}>
                { error }
            </Alert>
        ) : (
            <span className={styles.fileName}>
                { fileName }
            </span>
        );
    }

    renderToolTip() {
        const { errorMessage, isErrorVisible } = this;

        return isErrorVisible ? (
            <ToolTip
                className={styles.inputErrorTooltip}
                isCloseVisible={false}
                position="top"
                target={this.element}
                visible={isErrorVisible}>
                { errorMessage }
            </ToolTip>
        ) : null;
    }

    render() {
        const { className, id, label } = this.props;

        const cls = classNames([
            styles.fileContainer,
            className
        ]);

        const tooltip = this.renderToolTip();
        const content = this.renderContent();

        return(
            <div className={cls}>
                { tooltip }

                <input
                    ref={element => (this.element = element)}
                    type="file"
                    id={id}
                    className={styles.file}
                    onBlur={this.handleBlur}
                    onFocus={this.handleFocus}
                    onChange={this.handleChange} />

                <Button
                    tabIndex="-1"
                    type="tertiary"
                    onClick={this.handleClick}>
                { label }
                </Button>
                { content }
            </div>
        );
    }
}

export default File;
