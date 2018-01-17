import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import ToolTip from 'components/ToolTip';
import Keys from 'constants/keys';

import classNames from 'utils/classNames';
import styles from './TextArea.scss';

const ERROR_MSG = {
    REQUIRED: 'This field is required'
};

@observer
class TextArea extends Component {
    @observable isValid = true;
    @observable isErrorVisible = false;
    @observable errorMessage = '';

    defaultValue = '';
    isActive = false;
    element = null;

    static propTypes = {
        className: PropTypes.string,
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        errorMessage: PropTypes.string,
        id: PropTypes.string,
        isForm: PropTypes.bool,
        isRequired: PropTypes.bool,
        labelId: PropTypes.string,
        placeholder: PropTypes.string,
        onChange: PropTypes.func
    }

    static defaultProps = {
        isForm: false,
        isRequired: false
    }

    componentDidMount() {
        this.bindListeners();
    }
    componentWillMount() {
        const { defaultValue } = this.props;

        this.defaultValue = defaultValue;
    }
    componentWillUnmount() {
        this.releaseListeners();
    }
    bindListeners() {
        document.addEventListener('mousedown', this.handleDocumentClick,false);
        document.addEventListener('touchstart', this.handleDocumentClick,false);
    }
    releaseListeners() {
        document.removeEventListener('mousedown', this.handleDocumentClick);
        document.removeEventListener('touchstart', this.handleDocumentClick);
    }
    reset() {
        const { defaultValue } = this;
        this.isValid = true;
        this.element.value = defaultValue ? defaultValue : '';
    }

    validate() {
        const { value } = this.element;
        const { isRequired } = this.props;

        if(isRequired && !value) {
            this.errorMessage = ERROR_MSG.REQUIRED;
            return false;
        }
        this.errorMessage = '';
        return true;
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
        if(event.keyCode === Keys.TAB) {
            return false;
        }
        const { element, isActive, props } = this;
        const { onChange } = props;

        this.isValid = this.validate();
        this.isErrorVisible = !this.isValid && isActive && (this.errorMessage !== '');

        if(onChange) {
            onChange(event, this.isValid, element.value);
        }
    }

    @autobind handleMouseDown(event) {
        const { nativeEvent } = event;
        event.stopPropagation();
        nativeEvent.stopImmediatePropagation();
    }

    @autobind handleDocumentClick() {
        this.isActive = false;
        this.isErrorVisible = false;
    }

    renderTooltip() {
        const { errorMessage, isErrorVisible } = this;

        return isErrorVisible ? (
            <ToolTip
                className={styles.textAreaErrorTooltip}
                isCloseVisible={false}
                position="top"
                target={this.element}
                visible={isErrorVisible}>
                { errorMessage }
            </ToolTip>
        ) : null;
    }

    render() {
        const { isValid, props, defaultValue } = this;
        const { className, id, isForm, labelId, placeholder } = props;

        const clsContainer = classNames([
            styles.textAreaContainer,
            className
        ]);

        const clsTextArea = classNames([
            styles.textArea,
            !isValid ? styles.error : '',
            isForm ? styles.isForm : ''
        ]);

        const tooltip = this.renderTooltip();

        return (
            <div className={clsContainer}>
                { tooltip }
                <textarea
                    ref={element => (this.element = element)}
                    className={clsTextArea}
                    defaultValue={defaultValue}
                    id={id}
                    placeholder={placeholder}
                    onBlur={this.handleBlur}
                    onKeyUp={this.handleChange}
                    onClick={this.handleMouseDown}
                    onFocus={this.handleFocus}
                    onMouseDown={this.handleMouseDown} />
            </div>
        );
    }
}

export default TextArea;