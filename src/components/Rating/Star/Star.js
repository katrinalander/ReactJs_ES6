import React, { Component, PropTypes } from 'react';

import classNames from 'utils/classNames';
import styles from './Star.scss';

class Star extends Component {
    static propTypes = {
        isActive: PropTypes.bool,
        isActiveHalf: PropTypes.bool,
        willBeActive: PropTypes.bool,
        isDisabled: PropTypes.bool
    }

    static defaultProps = {
        isActive: false,
        isActiveHalf: false,
        willBeActive: false,
        isDisabled: false
    }

    render() {
        const { isDisabled, isActive, isActiveHalf, willBeActive } = this.props;
        const cls = classNames([
            styles.raterStar,
            isDisabled ? styles.disabled : null,
            isActive ? styles.active : null,
            isActiveHalf ? styles.activeHalf : null,
            willBeActive ? styles.willBeActive : null
        ]);
        return(
            <div className = {cls}></div>
        );
    }
}

export default Star;