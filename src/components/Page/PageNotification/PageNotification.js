import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import Icon from 'components/Icon';

import classNames from 'utils/classNames';

import styles from './PageNotification.scss';

const NOTIFICATION_TYPE_ALERT = 'alert';
const NOTIFICATION_TYPE_CONFIRMATION = 'confirmation';
const NOTIFICATION_TYPE_INFO = 'information';

@observer
class PageNotification extends Component {
    static propTypes = {
        annotation: PropTypes.string,
        className: PropTypes.string,
        message: PropTypes.string,
        type: PropTypes.oneOf([
            NOTIFICATION_TYPE_ALERT,
            NOTIFICATION_TYPE_CONFIRMATION,
            NOTIFICATION_TYPE_INFO
        ]).isRequired
    }

    renderIcon(type) {
        const cls = classNames([
            styles.icon,
            styles[type]
        ]);

        const iconTypeMap = {};

        iconTypeMap[NOTIFICATION_TYPE_ALERT] = {
            iconTypeMap: 'error'
        };
        iconTypeMap[NOTIFICATION_TYPE_CONFIRMATION] = {
            iconTypeMap: 'confirmation'
        };
        iconTypeMap[NOTIFICATION_TYPE_INFO] = {
            iconTypeMap: 'notification'
        };

        const iconType = iconTypeMap[type].iconTypeMap;
        console.log("icon type ",iconType);

        return iconType ? (
            <div className={styles.iconContainer}>
                <Icon type={iconType} className={cls}/>
            </div>
        ) : null;
    }

    renderMessage(message, type) {
        const cls = classNames([
            styles.message,
            styles[type]
        ]);

        return (
            <h2 className={cls}>
                { message }
            </h2>
        );
    }

    renderAnnotation(annotation, type) {
        const cls = classNames([
            styles.annotation,
            styles[type]
        ]);

        return (
            <p className={cls}>
                { annotation }
            </p>
        );
    }

    renderTracker(type){
        return type === NOTIFICATION_TYPE_CONFIRMATION ? (
            <div className={styles.trackerContainer}>
                <div className={styles.tracker} />
            </div>
        ) : null;
    }

    render() {
        const { annotation, className, message, type } = this.props;

        const iconElement = this.renderIcon(type);
        const messageElement = this.renderMessage(message,type);
        const annotationElement = this.renderAnnotation(annotation,type);
        const trackerElement = this.renderTracker(type);

        const cls = classNames([
            styles.notificationContainer,
            className
        ]);

        const clsNotification = classNames([
            styles.notification,
            styles[type]
        ]);

        return (
            <div className={cls}>
                <div className={styles.flexContainer}>
                    { iconElement }
                    <div className={clsNotification}>
                        { messageElement }
                        { annotationElement }
                    </div>
                </div>
                { trackerElement }
            </div>
        );
    }
}

export default PageNotification;