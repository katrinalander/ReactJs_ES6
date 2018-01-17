import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import autobind from 'autobind-decorator';

import Button from 'components/Button';
import Form from 'components/Form';
import FormField from 'components/Form/FormField';
import Input from 'components/Input';

import formSlyles from 'assets/styles/form.scss';
import styles from './Login.scss';

import defaultUser from '../../../constants/defaultUser.js';

const ErrorMessages = {
    USERNAME: 'Please Enter UserName'
};

@observer
class Login extends Component {
    userName = '';
    defaultUserName = defaultUser;
    @observable isDisabledButton = true;
    form = null;

    static propTypes = {
        viewModel: PropTypes.object.isRequired
    }

    componentDidMount() {
        this.userName = this.defaultUserName;
        this.isDisabledButton = false;
    }

    handleUserNameChange(isValid, userName) {
        this.userName = userName;
        this.isDisabledButton = !isValid;
    }

    @autobind handleLoginClick() {
        const { viewModel } = this.props;
        viewModel.setUserName(this.userName);
    }

    render () {
        return (
            <Form className={styles.frmLogin}>
                <FormField label="Enter Your UserName" labelId="lblUser" for="userName">
                    <div className={formSlyles.formControlContainer}>
                        <Input
                            defaultValue={this.defaultUserName}
                            id="username"
                            labelId="lblUser"
                            type="text"
                            placeholder="UserName"
                            errorMessage={ErrorMessages.USERNAME}
                            isForm={true}
                            isRequired={true}
                            onChange={(event,isValid,value) => this.handleUserNameChange(isValid, value)}
                        />
                    </div>
                </FormField>
                <div className={styles.butnSubmit}>&nbsp;</div>
                <Button disabled={this.isDisabledButton} onClick={() => this.handleLoginClick()}>Login</Button>
            </Form>
        );
    }
}

export default Login;