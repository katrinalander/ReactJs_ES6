import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import { observer, propTypes as ObservableTypes } from 'mobx-react';
import Form from 'components/Form';
import FormField from 'components/Form/FormField';
import DropDownList from 'components/DropDownList';
import DropDownOption from 'components/DropDownOption';
import Input from 'components/Input';
import DatePicker from 'components/DatePicker';
import getAccountDisplayName from 'utils/getAccountDisplayName';

import classNames from 'utils/classNames';
import formStyles from 'assets/styles/form.scss';
import styles from './CheckForm.scss';
import moment from 'moment';
import CheckTypes from 'constants/checkTypes';

const Masks = {
    CHECK: /^\d{1,10}$/i,
    PAYEE: /^([a-zA-Z0-9 ',.-]*)$/i
};

@observer
class CheckForm extends Component {
    form = null;
    isValid = true;
    // datePicker = null;

    check = null;
    checkNumber = null;
    payeeName1 = '';
    payeeName2 = '';
    checkAmount = '';
    checkDate = null;
    ErrorMessages = null;

    static propTypes = {
        check: ObservableTypes.objectOrObservableObject,
        viewModel: PropTypes.object.isRequired,
        onChange: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.check = props.check;
        this.ErrorMessages = {
            CHECK_FORMAT: 'ERROR! Wrong check format!',
            CHECK_AMOUNT_FORMAT: 'ERROR! Wrong amount format!',
            REQUIRED: 'ERROR! This line is required!',
            PAYEE: 'ERROR! Wrong payee format!'
        };
    }

    componentWillMount() {
        const { check } = this.props;
        this.check = check;
        this.checkDate = this.check.checkDate;
        this.checkNumber = this.check.checkNumber;
        this.payeeName1 = this.check.payeeName1;
        this.payeeName2 = this.check.payeeName2;
        this.checkAmount = this.check.checkAmount;
    }

    componentDidMount() {
        const { viewModel } = this.props;
        viewModel.getAccountList();
    }

    componentWillUpdate(nextProps) {
        this.check = nextProps.check;
        this.checkNumber = this.check.checkNumber;
        this.payeeName1 = this.check.payeeName1;
        this.payeeName2 = this.check.payeeName2;
        this.checkAmount = this.check.checkAmount;
    }

    reset() {
        this.form.reset();
    }

    validate() {
        this.isValid = this.form.validate();
    }

    @autobind
    twoWeeks(day) {
        const twoWeeksOut = moment().add(14,'days').calendar();
        return !day.isSameOrBefore(twoWeeksOut, 'day');
    }

    @autobind
    handleChange(isValid) {
        const { onChange } = this.props;
        this.isValid = isValid;

        if(onChange) {
            onChange(this.isValid,this.check);
        }
    }

    @autobind
    handleCheckChange(value, field) {
        this.check[field] = value;
        this[field] = value;
    }

    @autobind
    customValidation(dateVal) {
        const date = moment(dateVal, 'MM-DD-YYYY');
        const twoWeeksOut = moment().add(14,'days');
        if(date.isSameOrBefore(twoWeeksOut,'date') === false) {
            return false;
        }
        return true;
    }

    handleDateChange(date) {
        if (date) {
            this.check.checkDate = date.format('YYYY-MM-DDThh:mm:ss.s');
        }
        this.checkDate = date;
    }

    handleCheckAccountChange(value) {
        const values = value.split('|');
        this.check.accountName = values[0];
        this.check.accountNumber = values[1];
    }

    renderAccounts() {
        const { accounts } = this.props.viewModel;
        return accounts.map((account, index) => {
            return(
                <DropDownOption value={`${account.accountName}|${account.accountNumber}`} key={index}>{getAccountDisplayName(account.accountName, account.accountNumber) }</DropDownOption>
            );
        });
    }
    
    render() {
        const { check } = this;
        const { children } = this.props;
        const options = this.renderAccounts();
        
        const cls = classNames([
            formStyles.formControlContainer,
            formStyles.extraWidth
        ]);
        
        return (
            <Form ref={element => (this.form = element)} onChange={this.handleChange}>

                <FormField label="Check type" labelId="lblCheckType" for="ffCheckType">
                    <div className={formStyles.formControlContainer}>
                        <DropDownList
                            className={styles.ddCheckType}
                            errorMessage={this.ErrorMessages.REQUIRED}
                            id="ffCheckType"
                            labelId="lblCheckType"
                            isForm={true}
                            isRequired={true}
                            placeholder="Choose type..."
                            selectedValue={`${check.subType}`}
                            onChange={(event,value) => this.handleCheckChange(value,'subType')} >

                            <DropDownOption value={`${CheckTypes.ISSUED.value}`}>{CheckTypes.ISSUED.label}</DropDownOption>
                            <DropDownOption value={`${CheckTypes.VOIDED.value}`}>{CheckTypes.VOIDED.label}</DropDownOption>

                        </DropDownList>
                    </div>
                </FormField>
                <FormField label="Account Number" labelId="lblAccountNumber" for="ffAccountNumber">
                    <div className={cls}>
                        <DropDownList
                            className={styles.ddAccountNumber}
                            errorMessage={this.ErrorMessages.REQUIRED}
                            id="ffAccountNumber"
                            labelId="lblAccountNumber"
                            isForm={true}
                            isRequired={true}
                            placeholder="Choose account..."
                            selectedValue={check.accountName && check.accountNumber ? `${check.accountName}|${check.accountNumber}` : ''}
                            onChange={(event,value) => this.handleCheckAccountChange(value)} >

                            { options }

                        </DropDownList>
                    </div>
                </FormField>
                <FormField label="Check Number" labelId="lblCheckNumber" for="ffCheckNumber">
                    <div className={formStyles.formControlContainer}>
                        <Input
                            className={styles.inptCheckNumber}
                            errorMessage={this.ErrorMessages.CHECK_FORMAT}
                            type="text"
                            mask={Mask.CHECK}
                            id="ffCheckNumber"
                            labelId="lblCheckNumber"
                            isForm={true}
                            isRequired={true}
                            defaultValue={this.checkNumber}
                            onChange={(event,isValid,value) => this.handleCheckChange(value,'checkNumber')} />
                    </div>
                </FormField>
                <FormField label="Payee Name 1" labelId="lblPayeeName" for="ffPayeeName">
                    <div className={formStyles.formControlContainer}>
                        <Input
                            className={styles.inptPayee}
                            errorMessage={this.ErrorMessages.PAYEE}
                            type="text"
                            placeholder="Payee name..."
                            mask={Mask.CHECK}
                            id="ffPayeeName"
                            labelId="lblPayeeName"
                            isForm={true}
                            isRequired={true}
                            defaultValue={this.payeeName1}
                            onChange={(event,isValid,value) => this.handleCheckChange(value,'payeeName1')} />
                    </div>
                </FormField>
                <FormField label="Payee Name 2" labelId="lblPayeeName2" for="ffPayeeName2">
                    <div className={formStyles.formControlContainer}>
                        <Input
                            className={styles.inptPayee}
                            errorMessage={this.ErrorMessages.PAYEE}
                            type="text"
                            placeholder="Payee second name..."
                            mask={Mask.CHECK}
                            id="ffPayeeName2"
                            labelId="lblPayeeName2"
                            isForm={true}
                            isRequired={true}
                            defaultValue={this.payeeName1}
                            onChange={(event,isValid,value) => this.handleCheckChange(value,'payeeName2')} />
                    </div>
                </FormField>
                <FormField label="Amount USD" labelId="lblAmount" for="ffAmount">
                    <div className={formStyles.formControlContainer}>
                        <Input
                            className={styles.inptCheckAmount}
                            errorMessage={this.ErrorMessages.PAYEE}
                            type="text"
                            placeholder="Payee second name..."
                            mask={Mask.CHECK}
                            id="ffAmount"
                            labelId="lblAmount"
                            isForm={true}
                            isRequired={true}
                            defaultValue={this.checkAmount}
                            onChange={(event,isValid,value) => this.handleCheckChange(value,'checkAmount')} />
                    </div>
                </FormField>
                <FormField label="Issue date" labelId="lblIssueDate" for="ffIssueDate">
                    <div className={formStyles.formControlContainer}>
                        <DatePicker
                            className={styles.inptCheckDate}
                            date={this.checkDate}
                            isForm={true}
                            isRequired={true}
                            placeholder="Choose check date..."
                            onDateChange={(isValid,date) => this.handleDateChange(date)}
                            isOutsideRange={day => (this.twoWeeks(day))}
                            futureDate={this.futureDate}
                            customValidation={this.customValidation}
                            customValidationMsg={'Your date is more then two weeks out...'}
                        />
                    </div>
                </FormField>

                { children }

            </Form>
        );
    }
}

export default CheckForm;