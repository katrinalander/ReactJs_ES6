import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';

import Keys from 'constants/keys';

import classNames from 'utils/classNames';
import styles from './Button.scss';

class Button extends Component {
    element = null;

    static propTypes = {
        className: PropTypes.string,
        disables: PropTypes.bool,
        id: PropTypes.string,
        tabIndex: PropTypes.string,
        type: PropTypes.oneOf(['primary','secondary','tertiary']),
        onClick: PropTypes.func
    }

    static defaultProps = {
        disabled: false,
        type: 'primary'
    }

    @autobind
    handleKeyDown(event) {
        const { onClick } = this.props;
        const SPACE_BAR = 32;

        if(onClick && event.keyCode === Keys.ENTER || onClick && event.keyCode === SPACE_BAR) {
            onClick();
        }
    }

    @autobind
    handleClick(event) {
        const { onClick } = this.props;

        event.preventDefault();

        if(onClick) {
            onClick();
        }
    }

    focus() {
        this.element.focus();
    }

    render() {
        const { children, className, disabled, id, type, tabIndex } = this.props;

        const clsButton = classNames([
            styles.button,
            styles[type],
            disabled ? styles.disabled : '',
            className
        ]);

        const tabIndexObj = disabled ? {
            tabIndex: '-1'
        } : tabIndex ? {
            tabIndex
        } : {};

        return (
            <button
                ref={element => (this.element = element)}
                className={clsButton}
                disabled={disabled}
                id={id}
                {...tabIndexObj}
                onClick={this.handleClick}>
                { children }
            </button>
        );
    }
}

export default Button;