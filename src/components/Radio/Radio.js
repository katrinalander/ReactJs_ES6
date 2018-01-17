import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import classNames from 'utils/classNames';
import styles from './Radio.scss';

@observer
class Radio extends Component {
    static propTypes = {
        className: PropTypes.string,
        checked: PropTypes.bool,
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        viewModel: PropTypes.object.isRequired,
        onChange: PropTypes.func
    }

    @autobind handleChange(event) {
        const { onChange, value, viewModel } = this.props;
        viewModel.set('isChecked', event.target.checked);

        if(onChange) {
            onChange(event,value);
        }
    }

    render() {
        const { id, checked, className, value, name, label } = this.props;
        const attrs = { name };
        const cls = classNames([
            styles.radio,
            className
        ]);
        const clsout = classNames([
            styles.outerRadio
        ]);

        return (
            <div className={cls}>
                <div className={clsout}>
                    <input type="radio" id={id} checked={checked} value={value} {...attrs} onChange={this.handleChange} />

                    <div className={styles.selectedRadiobuttonContainer} aria-hidden="true">*</div>

                    <label className={styles.LabelRadio} htmlFor={id} id={styles.labelTest}>
                        <div>
                            <div className={styles.radiobuttonOuterCircle} aria-hidden="true">
                                <div className={styles.radiobuttonInnerCircle}>radio button</div>
                            </div>
                        </div>

                        <div className={styles.radiobuttonLabelContent}> { label || value } </div>

                    </label>
                </div>
            </div>
        );
    }
}

export default Radio;