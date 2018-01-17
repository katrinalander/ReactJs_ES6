import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';

import classNames from 'utils/classNames';
import styles from './Link.scss';
import Icon from 'components/Icon';

class Link extends Component {
    static propTypes = {
        classNames: PropTypes.string,
        disabled: PropTypes.bool,
        href: PropTypes.string.isRequired,
        showIcon: PropTypes.bool,
        target: PropTypes.string,
        onClick: PropTypes.func
    }

    static defaultProps = {
        disabled: false,
        showIcon: true
    }

    @autobind
    handleClick(event) {
        const { disabled, href, onClick } = this.props;

        if(!href) {
            event.preventDefault();
        }
        if(!disabled && onClick) {
            onClick(event);
        }
    }

    render() {
        const { children, className, disabled, href, showIcon, target } = this.props;

        const cls = classNames([
            styles.link,
            disabled ? styles.disabled : '',
            className
        ]);

        const iconCls = classNames([
            disabled ? styles.disabled : '',
            styles.linkIcon
        ]);
        
        const icon = showIcon ? (
            <Icon type="point-right" className={iconCls} />
        ) : null;

        return (
            <a
                disabled={disabled}
                href={href}
                target={target}
                className={cls}
                onClick={this.handleClick}
            >
                { children }
                { icon }
            </a>
        );
    }
}

export default Link;