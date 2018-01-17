import React, { Component, PropTypes } from 'react';

import classNames from 'utils/classNames';

import styles from './PageTitle.scss';

class PageTitle extends Component {
    static propTypes = {
        className: PropTypes.string
    }

    render() {
        const { children, className } = this.props;

        const cls = classNames([
            styles.pageTitle,
            className
        ]);

        return(
            <h2 className={cls}>
                { children }
            </h2>
        );
    }
}

export default PageTitle;