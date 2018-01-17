import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import { propTypes as ObservableTypes } from 'mobx-react';

import classNames from 'utils/classNames';
import styles from './StickyFooter.scss';

class StickyFooter extends Component {
    element = null;

    static propTypes = {
        classNames: PropTypes.string,
        data: PropTypes.oneOfType([
            ObservableTypes.observableArray,
            PropTypes.array
        ]).isRequired
    };

    componentDidMount() {
        const { element } = this;
        document.body.style.paddingBottom = `${element.offsetHeight}px`;
        this.bindListeners();
    }

    componentWillUnmount() {
        this.releaseListeners();
    }

    bindListeners() {
        window.addEventListener('resize',this.handleWindowResize,false);
    }
    releaseListeners() {
        window.removeEventListener('resize',this.handleWindowResize);
    }

    @autobind handleWindowResize(){
        this.assignBottomPadding();
    }
    assignBottomPadding() {
        const { element } = this;
        document.body.style.paddingBottom = `${element.offsetHeight}px`;
    }

    render() {
        console.log("footer!");
        const { className, children, data } = this.props;
        const cls = classNames([
            styles.stickyFooter,
            className
        ]);

        const footer = data.map((footerData, index) => {
            return(
                <dl key={index} className={styles.cell}>
                    <dt className={classNames([footerData.titleClassName, styles.title])}>{footerData.title}</dt>
                    <dt className={classNames([footerData.valueClassName, styles.value])}>{footerData.value}</dt>
                </dl>
            );
        });

        return (
            <footer className={cls} ref={element => (this.element = element)}>
                <div className={styles.cellsContainer}>
                    { footer }
                </div>
                <div className={styles.buttonsContainer}>
                    { children }
                </div>
            </footer>
        );
    }
}

export default StickyFooter;