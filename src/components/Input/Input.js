import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import ToolTip from 'components/ToolTip';

import Keys from 'constants/keys';
import convertCurrency from '../../utils/convertCurrency';

import classNames from '../../utils/classNames';
import styles from './Input.scss';

const ErrorMessage = {
    REQUIRED: 'This field is required.'
};

const Masks = {
    CURRENCY: /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/i
};

@observer
class Input extends Component {
    @observable currentValue = '';
    @observable isErrorVisible = false;
    @observable isValid = true;
    @observable errorMessage = '';

    value = '';
    isActive = false;

    static propTypes = {
        className: PropTypes.string,
        classNameErrorToolTip: PropTypes.string,
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        errorMessage: PropTypes.string,
        id: PropTypes.string,
        isForm: PropTypes.bool,
        isRequired: PropTypes.bool,
        isToolTipAvailable: PropTypes.bool,
        labelId: PropTypes.string,
        mask: PropTypes.object,
        placeholder: PropTypes.string,
        type: PropTypes.oneOf(['currency','text']),
        onBlur: PropTypes.func,
        onChange: PropTypes.func,
        onFocus: PropTypes.func
    };

    static defaultProps = {
        isForm: false,
        isRequired: false,
        isToolTipAvailable: true,
        type: 'text'
    };

    componentWillMount() {
        const { defaultValue } = this.props;

        this.value = defaultValue ? defaultValue : '';
        this.currentValue = defaultValue ? defaultValue : '';

        this.currentValue = this.formatValue(this.currentValue);
    }

    componentDidMount() {
        this.bindListeners();
    }

    componentWillUnmount() {
        this.releaseListeners();
    }

    bindListeners() {
        document.addEventListener('mousedown', this.handleDocumentClick, false);
        document.addEventListener('touchstart', this.handleDocumentClick, false);
    }

    releaseListeners() {
        document.removeEventListener('mousedown', this.handleDocumentClick);
        document.removeEventListener('touchstart', this.handleDocumentClick);
    }

    reset() {
        const { value } = this;

        this.isValid = true;
        this.currentValue = value ? value : '';
    }

    validate() {
        const { currentValue } = this;
        const { errorMessage, isRequired, mask, type } = this.props;

        let currentMask = null;

        if (type === 'currency') {
            currentMask = Masks.CURRENCY;
        }
        else {
            currentMask = mask;
        }

        const isMatch = currentMask ? currentMask.test(currentValue) : true;

        if (isRequired && !currentValue) {
            this.errorMessage = ErrorMessage.REQUIRED;
            return false;
        }
        else if (currentValue && currentMask && !isMatch) {
            this.errorMessage = errorMessage ? errorMessage : '';
            return false;
        }
        this.errorMessage = '';
        return true;
    }

    formatValue(value) {
        const { type } = this.props;

        if(type === 'currency') {
            const formattedValue = value ? convertCurrency.format(value) : '';
            return formattedValue === 'NaN' ? this.currentValue : formattedValue.substring(1, formattedValue.length);
        }
        return this.currentValue;
    }

    @autobind handleBlur() {
        const { onBlur } = this.props;

        this.isActive = false;
        this.isErrorVisible = false;
        this.currentValue = this.formatValue(this.currentValue);

        if(onBlur) {
            onBlur();
        }
    }

    @autobind handleFocus() {
        const { onFocus } = this.props;

        this.isActive = true;
        this.isErrorVisible = !this.isValid && (this.errorMessage !== '');

        if (onFocus) {
            onFocus();
        }
    }

    @autobind handleChange(event) {
        if (event.keyCode === Keys.TAB) {
            return false;
        }

        const { element, isActive, props } = this;
        const { onChange } = props;

        this.currentValue = element.value;
        this.isValid = this.validate();
        this.isErrorVisible = !this.isValid && isActive && (this.errorMessage !== '');

        if (onChange) {
            onChange(event, this.isValid, this.currentValue);
        }
    }

    @autobind handleMouseDown(event) {
        const { nativeEvent } = event;

        event.stopPropagation();
        nativeEvent.stopImmediatePropagation();
    }

    @autobind handleDocumentClick() {
        this.isActive = false;
    }

    renderCurrencySign() {
        const { currencySign, isForm, type } = this.props;

        const cls = classNames([
            styles.inputCurrencySign,
            isForm ? styles.isForm : ''
        ]);

        const sign = currencySign ? currencySign : '$';

        return type === 'currency' ? (
            <span className={cls}>
                { sign }
            </span>
        ) : null;
    }

    renderTooltip() {
        const { errorMessage, isErrorVisible } = this;
        const {classNameErrorToolTip, isToolTipAvailable } = this.props;

        const cls = classNames([
            styles.inputErrorTooltip,
            classNameErrorToolTip
        ]);

        return isErrorVisible && isToolTipAvailable ? (
            <ToolTip
                className={cls}
                isCloseVisible={false}
                position="top"
                target={this.element}
                visible={isErrorVisible}>
                { errorMessage }
            </ToolTip>
        ) : null;
    }

    render() {
        const { isValid, props } = this;
        let { currentValue } = this;
        const { className, id, isForm,labelId, placeholder, type } = props;

        const clsContainer = classNames([
            styles.inputContainer,
            className
        ]);
        const clsInput =classNames([
            styles.input,
            !isValid ? styles.error : '',
            isForm ? styles.isForm : '',
            type === 'currency' ? styles.isCurrency : ''
        ]);

        const currencySign = this.renderCurrencySign();
        const tooltip = this.renderTooltip();

        return(
            <div className={clsContainer}>
                { currencySign }
                <input
                    ref={element => (this.element = element)}
                    autoComplete="off"
                    aria-describedby={labelId}
                    aria-invalid={!isValid}
                    aria-label={placeholder}
                    className={clsInput}
                    value={currentValue}
                    id={id}
                    type="text"
                    placeholder={placeholder}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                    onClick={this.handleMouseDown}
                    onFocus={this.handleFocus}
                    onMouseDown={this.handleMouseDown}
                />
                { tooltip }
            </div>
        );
    }
}

export default Input;