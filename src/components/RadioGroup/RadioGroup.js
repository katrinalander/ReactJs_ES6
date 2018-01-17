import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import classNames from 'utils/classNames';

import Radio from 'components/Radio';
import styles from './RadioGroup.scss';

const ALIGN_H = 'horizontal';
const ALIGN_V = 'vertical';

@observer
class RadioGroup extends Component {
    @observable value = '';
    @observable isValid = true;

    value = '';
    defaultValue = '';
    element = null;
    isActive = false;

    static propTypes = {
        classNames: PropTypes.string,
        isRequired: PropTypes.bool,
        type: PropTypes.oneOf([ALIGN_H, ALIGN_V]),
        value: PropTypes.string,
        onChange: PropTypes.func
    }

    static defaultProps = {
        isRequired: false,
        type:ALIGN_H
    }

    componentWillMount() {
        const { value } = this.props;
        this.value = value;
        this.defaultValue = value;
    }

    reset() {
        const { defaultValue } = this;
        this.isValid = true;
        this.value = defaultValue;
    }

    validate() {
        const { isRequired } = this.props;
        return !(isRequired && !this.value);
    }

    @autobind handleChange(event, value) {
        const { onChange } = this.props;

        this.value = value;
        this.isValid = this.validate();

        if(onChange) {
            onChange(event,value,this.isValid);
        }
    }

    renderGroup() {
        const { children, type } = this.props;
        const { value } = this;
        const cls = classNames([
            styles.options
        ]);

        const options = children.map((child,index) => {
            const { props } = child;
            const clsType = classNames([
                (type === ALIGN_H) ? styles.horizontalRadio : (type === ALIGN_V) ? styles.verticalRadio : ''
            ]);

            return(
                <Radio {...props} className={clsType} type={type} checked={value === props.value} key={index} onChange={this.handleChange} />
            );
        });

        return (
            <div className={cls}>
                { options }
            </div>
        );
    }

    render() {
        const group = this.renderGroup();
        const { className, type } = this.props;

        const cls = classNames([
            styles.radioButton,
            className
        ]);

        return (
            <div className={cls} type={type} ref={element => (this.element = element)}>
                { group }
            </div>
        );
    }
}

export default RadioGroup;