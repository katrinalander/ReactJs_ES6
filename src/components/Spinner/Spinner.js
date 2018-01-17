import React, { Component, PropTypes } from 'react';

import classNames from 'utils/classNames';
import styles from './Spinner.scss';

class Spinner extends Component {
    static propTypes = {
        classNames: PropTypes.string
    }

    render() {
        const { className } = this.props;

        const cls = classNames([
            styles.spinner,
            className
        ]);

        return (
            <div className={cls} tabIndex="-1">
                <div className={styles.spinnerContainer}>
                    <span className={styles.spinnerElement} />
                    <span className={styles.hideLabel}>
                        Loading...
                    </span>
                </div>
            </div>
        );
    }
}

export default Spinner;