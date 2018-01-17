import React, { Component, PropTypes } from 'react';

import FormField from 'components/Form/FormField';
import Keys from 'constants/keys';

import styles from './Form.scss';
import classNames from 'utils/classNames';

class Form extends Component {
    static propTypes = {
        classNames: PropTypes.string,
        onChange: PropTypes.func
    }

    isValid = true;
    element = null;
    controls = [];

    reset() {
        const { controls, element } = this;
        this.isValid = true;
        element.reset();
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

    handleChange(event, isValid, element) {
        const { onChange } = this.props;
        this.isValid = isValid && this.validate();
        if(element.props.onChange) {
            element.props.onChange(event, this.isValid);
        }
        if(onChange) {
            onChange(this.isValid);
        }
    }

    handleEnterKeyPress(event) {
        const enter = event.keyCode || event.which;
        if(enter === Keys.Enter && event.target.type !== 'submit') {
            event.preventDefault();
            return false;
        }
    }

    renderChildren() {
        const { children } = this.props;
        const arrChildren = children.length ? children : [children];
        this.controls = [];
        return arrChildren.map((child, index) => {
            if(!child) {
                return null;
            }
            const { props } = child;
            const content = props.children;

            if(child.type === FormField) {
                return (
                    <FormField
                        ref={element => {
                            if(element) {this.controls.push(element);}
                        }}
                        key={index}
                        {...props}
                        onChange={(event, isValid) => this.handleChange(event,isValid,child)} >
                        { content }
                    </FormField>
                );
            }
            return child;
        });
    }

    render() {
        const { className } = this.props;
        const cls = classNames([
            styles.form,
            className
        ]);
        const children = this.renderChildren();

        return (
            <form className={cls} onKeyPress={this.handleEnterKeyPress} type="multipart/form-data" ref={element => (this.element = element)}>
                { children }
            </form>
        );
    }
}

export default Form;