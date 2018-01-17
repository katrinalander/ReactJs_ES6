import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import autobind from 'autobind-decorator';

import classNames from '../../utils/classNames';
import styles from './Icon.scss';

@observer
class Icon extends Component {

    static propTypes = {
        className: PropTypes.string,
        disabled: PropTypes.bool,
        disabledClassName: PropTypes.string,
        tabIndex: PropTypes.string,
        type: PropTypes.string.isRequired,
        onClick: PropTypes.func
    };

    @autobind
    handleClick(event) {
        const { onClick } = this.props;

        if (onClick) {
            onClick(event);
        }
    }

    render() {
        const { className, disabled, disabledClassName, type, onClick, tabIndex } = this.props;

        const clsWrapper = classNames([
            styles.iconButton,
            disabled ? styles.iconDisabled : '',
            className,
            disabled ? disabledClassName : ''
        ]);
        const clsIcon = classNames([
            styles.icon,
            styles[type],
            disabled ? styles.iconDisabled : '',
            disabled ? disabledClassName : ''
        ]);

        return onClick && !disabled ? (
            <button ref="button" className={clsWrapper} onClick={this.handleClick} tabIndex={tabIndex}>
                <i className={clsIcon} />
            </button>
        ) : (
            <span className={clsWrapper}>
                <i className={clsIcon} />
            </span>
        );
    }
}

export default Icon;