import { action, observable } from 'mobx';

const DEFAULT_ROUTE = 'components';

class Router {
    static instance = null;

    static getInstance() {
        return this.instance;
    }

    @observable activeRoute = DEFAULT_ROUTE;

    static create(routes) {
        if (!this.instance) {
            this.instance = new Router(routes);
        }

        return this.instance;
    }

    constructor(routes) {
        this.routes = routes;
    }

    getRouteParams() {
        return window.history.state;
    }

    navigateToRoute(path, params) {
        const pathParts = path.split('#');
        const routeName = pathParts[0].split('?')[0];
        const queryString = pathParts[1] && pathParts[1].split('?')[0];

        window.history.pushState({params, routeName, queryString}, '', path);
        document.body.scrollTop = 0;
        this.setActiveRoute(routeName);
    }

    @action setActiveRoute(path){
        this.activeRoute = path;
    }

    getActiveRouteObj() {
        let item = null;

        this.routes.some(route => {
            if (route.path === this.activeRoute) {
                item = route;

                return true;
            }
        });

        return item;
    }
}

export default Router;