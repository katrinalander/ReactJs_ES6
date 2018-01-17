import React, { Component, PropTypes } from 'react';

import Icon from 'components/Icon';

import classNames from 'utils/classNames';
import styles from './Alert.scss';

class Alert extends Component {
    static propTypes ={
        className: PropTypes.string,
        id: PropTypes.string,
        type: PropTypes.string
    };

    static defaultProps = {
        type: 'alert'
    };

    render() {
        const { children, className, id, type } = this.props;

        const cls = classNames([
            styles.alert,
            type !== 'alert' ? styles[type] : '',
            className
        ]);

        const iconType = type === 'alert' ? 'error' : 'notification';

        return(
            <div className={cls} id={id} role="region">
                <div className={styles.alertFlexContainer}>
                    <span className={styles.alertIconContainer}>
                        <Icon type={iconType} className={styles.alertIcon} />
                    </span>
                    <div className={styles.alertContent}>
                        <span className={styles.alertTitle}>
                            { children }
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Alert;