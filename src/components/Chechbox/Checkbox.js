import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import autobind from 'autobind-decorator';

import classNames from 'utils/classNames';
import styles from './Checkbox.scss';

import Keys from 'constants/keys';

@observer
class Checkbox extends Component {
    static propTypes = {
        checked: PropTypes.bool,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        label: PropTypes.string,
        value: PropTypes.object,
        viewModel: PropTypes.object.isRequired,
        onClick: PropTypes.func
    }

    static defaultProps = {
        checked: false
    }

    constructor(props) {
        super(props);

        const { viewModel} = props;

        viewModel.isChecked = props.checked;
        viewModel.isDisabled = props.disabled;
    }

    componentWillReceiveProps(nextProps) {
        const { viewModel } = this.props;

        viewModel.isChecked = nextProps.checked;
        viewModel.isDisabled = nextProps.disabled;
    }

    @autobind
    handleClick(event) {
        const { onClick, viewModel, value } = this.props;

        if (viewModel.isDisabled) {
            return false;
        }

        const isChecked = !viewModel.isChecked;
        viewModel.set('isChecked', isChecked);

        if(onClick) {
            onClick(event, value, isChecked);
        }
    }

    @autobind
    onKeyPressed(event) {
        if (event.keyCode === Keys.ENTER) {
            const { onClick, viewModel, value } = this.props;

            if(viewModel.isDisabled) {
                return false;
            }

            const isChecked = !viewModel.isChecked;
            viewModel.set('isChecked', isChecked);

            if(onClick) {
                onClick(event,value,isChecked);
            }
        }
    }

    render() {
        const { viewModel, className, value, label } = this.props;

        const cls = classNames([
            styles.checkbox,
            className,
            viewModel.isDisabled ? styles.disabled : '',
            viewModel.isChecked ? styles.selectCheckbox : ''
        ]);

        return (
            <div className={styles.checkboxContainer}>

                <input type="checkbox" onClick={this.handleClick} onKeyDown={this.onKeyPressed} className={styles.regularCheckbox} />

                <div className={cls}
                     value={value}
                     label={label} />

                <label className={styles.labelCheckbox} onClick={this.handleClick}>{label}</label>
            </div>
        );
    }
}

export default Checkbox;
