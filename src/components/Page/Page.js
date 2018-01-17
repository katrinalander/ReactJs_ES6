import React, { Component, PropTypes } from 'react';
// import autobind from 'autobind-decorator';
import { propTypes as ObservableTypes } from 'mobx-react';

import Annotation from 'components/Annotation';
import PageNotification from './PageNotification';
import PageTitle from './PageTitle';

import classNames from 'utils/classNames';
import styles from './Page.scss';

const PageType = {
    MODAL: 'modal',
    REGULAR: 'regular'
};

class Page extends Component {
    static propTypes = {
        annotation: PropTypes.element,
        className: PropTypes.string,
        notification: PropTypes.oneOfType([
            ObservableTypes.observableObject,
            PropTypes.object
        ]),
        router: PropTypes.object,
        title:PropTypes.string,
        type: PropTypes.oneOf([PageType.MODAL, PageType.REGULAR])
    }

    static defaultProps = {
        type: PageType.REGULAR
    }

    renderAnnotation(annotation, title) {
        if (annotation) {
            return (
                <Annotation content={annotation} title={title}/>
            );
        }
        return null;
    }

    renderPageNotification(notification) {
        if (notification) {
            return (
                <PageNotification { ...notification } />
            );
        }

        return null;
    }

    render() {
        const { annotation, children, className, notification, title } = this.props;

        const cls = classNames ([
            styles.page,
            className
        ]);

        const pageAnnotation = this.renderAnnotation(annotation, title);
        const pageNotification = this.renderPageNotification(notification);

        const pageTitle = title ? (<PageTitle className={styles.pageTitle}>
            { title }
            { pageAnnotation }
        </PageTitle>) : null;

        return(
            <div className={cls}>
                { pageNotification }
                <div className={styles.pageTitleContainer}>
                    { pageTitle }
                </div>
                { children }
            </div>
        );
    }
}

export default Page;