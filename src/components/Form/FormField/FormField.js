import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import File from 'components/File';
import TextArea from 'components/TextArea';
import DropDownList from 'components/DropDownList';
import DatePicker from 'components/DatePicker';
import RadioGroup from 'components/RadioGroup';
import Input from 'components/Input';

import styles from './FormField.scss';
import classNames from 'utils/classNames';

@observer
class FormField extends Component {
    static propTypes = {
        className: PropTypes.string,
        for: PropTypes.string,
        label: PropTypes.string,
        labelId: PropTypes.string,
        onChange: PropTypes.func
    }

    @observable isValid = true;

    controls = [];

    reset() {
        const { controls } = this;

        this.isValid = true;
        controls.forEach(control => (control.reset()));
    }

    validate() {
        const { controls } = this;
        let isValid = true;

        controls.some(control => {
            if(control && !control.validate()) {
                isValid = false;
                return true;
            }
        });

        return isValid;
    }

    assignOnChange(element,index) {
        if(typeof element === 'string') {
            return element;
        }

        const { props } = element;
        const { children } = props;
        let content = null;

        if(children instanceof Array) {
            // Array of elements
            content = children.map((child,i) => this.assignOnChange(child,i));
        }
        else if (children) {
            // single element
            content = this.assignOnChange(children, 0);
        }

        if(element.type === Input) {
            return (
                <Input ref={control =>{
                    if(control) {
                        this.controls.push(control);
                    }
                }} {...props} key={index} onChange={(event,isValid, value) => this.handleChange(event,isValid,element,value)} />
            );
        }
        if(element.type === TextArea) {
            return (
                <TextArea ref={control => {
                    if(control) {
                        this.controls.push(control);
                    }
                }} {...props} key={index} onChange={(event,isValid, value) => this.handleChange(event,isValid,element,value)} />
            );
        }
        if(element.type === File) {
            return (
                <File ref={control => {
                    if(control) {
                        this.controls.push(control);
                    }
                }} {...props} key={index} onChange={(event,isValid, file) => {this.handleChange(event,isValid,element,file)}} />
            );
        }
        if(element.type === DropDownList) {
            return (
                <DropDownList ref={control => {
                    if(control) {
                        this.controls.push(control);
                    }
                }} {...props} key={index} onChange={(event,isValid,value) => this.handleChange(event,isValid,element,value)} />
            );
        }
        if(element.type === DatePicker) {
            return (
                <DatePicker ref={control => {
                    if(control) {
                        this.controls.push(control);
                    }
                }} {...props} key={index} onChange={(isValid, value) => this.handleChange(isValid,element,value)} />
            );
        }
        if(element.type === RadioGroup) {
            return (
                <RadioGroup ref={control => {
                    if(control) {
                        this.controls.push(control);
                    }
                }} {...props} key={index} onChange={(event,isValid, value) => this.handleChange(event,isValid,element,value)} />
            );
        }

        return React.createElement(element.type, { key: index, ...props }, content);
    }

    handleChange(event, isValid, element, value, title) {
        const { onChange } = this.props;
        this.isValid = isValid && this.validate();

        if(element.props.onChange) {
            if(
                element.type === Input ||
                element.type === TextArea ||
                element.type === File
            ) {
                element.props.onChange(event,isValid,value);
            }
            if(
                element.type === DropDownList ||
                element.type === RadioGroup
            ) {
                element.props.onChange(event, value, isValid)
            }
        }
        if(onChange) {
            onChange(event, this.isValid, value);
        }
    }

    handleDateChange(isValid, value, element) {
        const { onChange } = this.props;
        this.isValid = isValid && this.validate();
        if(element.props.onDateChange) {
            element.props.onDateChange(isValid, value);
        }
        if(onChange) {
            onChange(null, this.isValid);
        }
    }

    renderChildren() {
        const { children } = this.props;
        this.controls = [];

        if(children instanceof Array) {
            return children.map((child,index) => this.assignOnChange(child, index));
        }
        else if (children) {
            return this.assignOnChange(children, 0);
        }
    }

    render() {
        const { isValid } = this;
        const { className, label, labelId } = this.props;
        const htmlFor = this.props.for;

        const cls = classNames([
            styles.formField,
            className
        ]);

        const clsLabel = classNames([
            styles.formFieldLabel,
            isValid ? '' : styles.formFieldLabelError
        ]);

        const clsControl = classNames([
            styles.formFieldControl
        ]);

        const children = this.renderChildren();

        return(
            <div className={cls}>
                <label id={labelId} htmlFor={htmlFor} aria-label={label} aria-hidden="true" className={clsLabel}>
                    { label }
                </label>
                <div className={clsControl}>
                    { children }
                </div>
            </div>
        );
    }
}

export default FormField;