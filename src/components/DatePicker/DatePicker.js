import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { SingleDatePicker } from 'react-dates';

import Icon from 'components/Icon';
import ToolTip from 'components/ToolTip';

import classNames from 'utils/classNames';
import moment from 'moment';

import styles from './DatePicker.scss';
import 'react-dates/lib/css/_datepicker.css';

import noValue from 'constants/noValue';

@observer
class DatePicker extends Component {
    @observable currentDate = null;
    @observable isFocused = false;
    @observable isValid = true;
    @observable isErrorVisible = false;
    @observable errorMessage = '';
    @observable inputVal = '';

    isResetting = false;
    isActive = false;
    defaultDate = null;
    toolTipTarget = null;

    static propTypes = {
        classNames:PropTypes.string,
        customValidation: PropTypes.func,
        customValidationMsg: PropTypes.string,
        date: PropTypes.oneOfType([PropTypes.string,PropTypes.instanceOf(moment)]),
        enableOutsideDays: PropTypes.bool,
        focused: PropTypes.bool.isRequired,
        id: PropTypes.string,
        inputValue: PropTypes.func,
        isForm: PropTypes.bool,
        isOutsideRange: PropTypes.func,
        isRequired: PropTypes.bool,
        placeholder: PropTypes.string,
        onDateChange: PropTypes.func.isRequired
    }

    static defaultProps = {
        enableOutsideDays: false,
        focused: false,
        isForm: false,
        isRequired: false
    }

    componentWillMount() {
        const { date } = this.props;

        this.currentDate = date && date !== noValue ? moment(date) : null;
        this.defaultDate = date && date !== noValue ? moment(date) : null;
    }

    componentWillReceiveProps(nextProps) {
        const { date } = nextProps;
        const prevDate = this.currentDate && this.currentDate.toString();

        this.currentDate = date && date !== noValue ? moment(date) : null;

        if(this.currentDate && prevDate !== (this.currentDate && this.currentDate.toString())){
            this.handleDateChange(this.currentDate);
        }
    }

    componentDidMount() {
        this.bindListeners();
    }

    componentWillMount() {
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
        const { defaultDate } = this;
        const { onDateChange } = this.props;

        this.currentDate = defaultDate ? defaultDate : null;
        this.isValid = true;

        this.isResetting = true;
        if(onDateChange) {
            onDateChange(this.isValid, this.currentDate);
        }
        this.isResetting = false;
    }

    validate() {
        const { currentDate, inputVal, isResetting } = this;
        const { isRequired, customValidation, customValidationMsg } = this.props;
        let isValid = true;
        this.errorMessage = '';

        if (isResetting) {
            return true;
        }

        // if required
        if(isRequired && !currentDate) {
            this.errorMessage = "Wrong date format.";
            isValid = false;
        }

        // run custom
        if(customValidation && inputVal && !customValidation(inputVal)) {
            this.errorMessage = customValidationMsg;
            isValid = false;
            this.isErrorVisible = true;
        }

        return isValid;
    }

    handleStateChange(date) {
        const dateChecker = /^(0[1-9]|[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
        this.inputVal = '';
        if (dateChecker.test(date.target.value)) {
            this.inputVal = date.target.value;
            this.isValid = this.validate();
        }
    }

    @autobind handleDocumentClick() {
        this.isActive = false;
        this.isErrorVisible = false;
    }

    @autobind handleBlur() {
        this.isActive = false;
        this.isErrorVisible = false;
    }

    @autobind handleFocus() {
        this.isActive = true;
        this.isErrorVisible = !this.isValid && (this.errorMessage !== '');
    }

    handleFocusChange(focused) {
        const isFocused = focused || false;

        if(!isFocused) {
            this.handleDateChange(this.currentDate);
        }

        this.isFocused = isFocused;
        this.isActive = isFocused;
        this.isErrorVisible = isFocused && !this.isValid && (this.errorMessage !== '');
    }

    handleDateChange(date){
        const { isActive, errorMessage } = this;
        const { onDateChange } = this.props;
        this.inputVal = '';

        this.currentDate = date;
        this.isValid = this.validate();
        this.isErrorVisible = !this.isValid && isActive && (errorMessage !== '');

        if(onDateChange) {
            onDateChange(this.isValid,date);
        }
    }

    renderToolTip() {
        const { errorMessage, isErrorVisible } = this;

        return isErrorVisible ? (
            <ToolTip
                className={styles.errorTooltip}
                isCloseVisible={false}
                position="top"
                target={this.toolTipTarget}
                visible={isErrorVisible}>
                { errorMessage }
            </ToolTip>
        ) : null;
    }

    render() {
        const { isValid, props } = this;
        const { className, enableOutsideDays, id, isForm, isOutsideRange, isRequired, placeholder } = props;

        const cls = classNames ([
            styles.root,
            !isValid ? styles.error : '',
            isForm ? styles.isForm : '',
            className
        ]);

        const tooltip = this.renderToolTip();

        return(
            <div className={cls}
                 onBlur={this.handleBlur}
                 onFocus={this.handleFocus}
                 onChange={(event) => this.handleStateChange(event)} >
                <div className={styles.target}
                     ref={element => (this.toolTipTarget = element)} />
                { tooltip }
                <SingleDatePicker
                    enableOutsideDays={enableOutsideDays}
                    date={this.currentDate}
                    focused={this.isFocused}
                    id={id}
                    isOutsideRange={isOutsideRange}
                    screenReaderInputMessage={placeholder}
                    showDefaultInputIcon={false}
                    placeholder={placeholder}
                    numberOfMonths={1}
                    customInputIcon={<Icon type="calendar" />}
                    readOnly={false}
                    required={isRequired}
                    navPrev={<Icon type="chevron-left" />}
                    navNext={<Icon type="chevron-right" />}
                    hideKeyboardShourtcutsPanel={true}
                    onFocusChange={focused => this.handleFocusChange(focused.focused)}
                    onDateChange={(date) => this.handleDateChange(date)}
                />
            </div>
        );
    }
}

export default DatePicker;
