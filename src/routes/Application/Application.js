import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import autobind from 'autobind-decorator';

import Navigation from './Navigation';
import DevTools from 'mobx-react-devtools';
import Login from './Login';

import styles from './Application.scss';

const DEFAULT_ROUTE = 'summary';

@observer
class Application extends Component {

    static propTypes = {
        router: PropTypes.object.isRequired,
        viewModel: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        const { router, viewModel } = this.props;
        viewModel.set('router', router);

        const locationParts = document.location.href.split('/');
        router.navigateToRoute(locationParts[locationParts.length - 1] || DEFAULT_ROUTE);

        window.onpopstate = event => {
          const { path } = event.state || { path: '' };

          router.setActiveRoute(path);
        };
    }

    componentWillMount() {
        document.addEventListener('DOMSubtreeModified', this.handleMutation);
    }

    componentWillUnmount() {
        document.removeEventListener('DOMSubtreeModified', this.handleMutation);
    }

    @autobind handleMutation() {
        const { router } = this.props;

        //we need to send the message to parent application because when component rerendered wendow, resize event not fiering
        const height = document.documentElement.scrollHeight;
    }

    renderHeader() {
        return (
            <div>
                <p>HERE WILL BE HEADER!</p>
            </div>
        );
    }

    renderNavigation() {
        const { router } = this.props;

        return(
            <Navigation router={router} />
        );
    }

    renderDevTools() {
        return (
            <DevTools position={{ bottom: 0, right: 0 }} />
        );
    }

    renderComponent() {
        const { router } = this.props;

        const activeRouteObj = router.getActiveRouteObj();
        const RouteComponent = activeRouteObj ? activeRouteObj.component : null;

        if (RouteComponent) {
            return(
                <RouteComponent router={router} />
            );
        }
    }

    render() {
        const { viewModel } = this.props;
        const header = this.renderHeader();
        const navigation = this.renderNavigation();
        const devTools = this.renderDevTools();
        const component = this.renderComponent();

        const page = viewModel.userName ? (
            <div className={styles.root}>
                { header }
                { navigation }
                { devTools }
                { component }
            </div>
        ) : (
            <Login viewModel={viewModel} />
        );

        return page;
    }
}

export default Application;