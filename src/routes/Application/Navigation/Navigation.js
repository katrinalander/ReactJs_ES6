import React, { Component, PropTypes } from 'react';

import classNames from '../../../utils/classNames';

import styles from './Navigation.scss';

const ROUTIES = ['First', 'Second', 'Third'];
const SUB_ROUTES = [
    { title: 'Summary', route: 'summary' },
    { title: 'Enter checks', route: 'summaryL' },
    { title: 'Reports', route: 'reports'}
];

class Navigation extends Component {
    static propTypes = {
        router: PropTypes.object.isRequired
    }

    handleNavigateToRoute(route) {
        const { router } = this.props;

        router.navigateToRoute(route);
    }

    renderNavigation(routes = []) {
        return routes.map((item, index) => {
            return (
                <li key={index} className={styles.navigationItem}>
                    <a className={styles.navigationLink} onClick={() => this.handleNavigateToRoute(item.route)}>
                        {item.title}
                    </a>
                </li>
            );
        });
    }

    render() {
        const clsTopNav = classNames([
            styles.navigationList,
            styles.topNavigationList
        ]);

        const clsSubNav = classNames([
            styles.navigationList,
            styles.subNavigationList
        ]);

        const topNavigation = this.renderNavigation(ROUTIES);
        const subNavigation = this.renderNavigation(SUB_ROUTES);

        return(
            <div className={styles.navigation}>
                <ul className={clsTopNav}>
                    {topNavigation}
                </ul>
                <ul className={clsSubNav}>
                    {subNavigation}
                </ul>
            </div>
        );
    }
}

export default Navigation;