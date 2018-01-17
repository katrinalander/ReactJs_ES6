import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import autobind from 'autobind-decorator';

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import Icon from 'components/Icon';
import Annotation from 'components/Annotation';
import Spinner from 'components/Spinner';

import classNames from 'utils/classNames';
import styles from './Panel.scss';

const ANIMATION_TIMEOUT = 300;

@observer
class Panel extends Component {
    element = null;
    @observable expanded = true;

    static propTypes = {
        annotation: PropTypes.element,
        classNames: PropTypes.string,
        expandable: PropTypes.bool,
        expanded: PropTypes.bool,
        loading: PropTypes.bool,
        title: PropTypes.string
    }

    static defaultProps = {
        expanded: true,
        expandable: true
    }

    constructor(props) {
        super(props);
        this.expanded = typeof props.expanded === 'boolean' ? props.expanded : true;
    }

    @autobind togglePanel(){
        this.expanded = !this.expanded;
    }

    renderExpander() {
        const { expanded, props } = this;
        const { expandable } = props;
        
        const iconCls = classNames([
            styles.panelHeaderExpanderIcon,
            expanded ? styles.expanded : styles.collapsed
        ]);
        
        return expandable ? (
            <div className={styles.panelHeaderExpander}>
                <Icon type="chevron-down" className={iconCls} onClick={this.togglePanel} />
            </div>
        ) : null;
    }

    renderAnnotation(annotation, title) {
        if (annotation) {
            return(
                <Annotation content={annotation} title={title} />
            );
        }
        return null;
    }

    renderHeader() {
        const { props } = this;
        const { annotation, title } = props;
        const expander =this.renderExpander();
        const titleAnnotation = this.renderAnnotation(annotation, title);
        const content = title ? (
            <h3 className={styles.panelHeader}>
                { expander }
                { title }
                <div className={styles.panelHeaderInfo} ref={this.setReference}>
                    { titleAnnotation }
                </div>
            </h3>
        ) : null;

        return content;
    }

    renderContent() {
        const { expanded } = this;
        const { children, loading } = this.props;
        const content = expanded ? loading ? (
            <Spinner />
        ) : (
            <div className={styles.panelContentContainer}>
                { children }
            </div>
        ) : null;

        return content;
    }

    render() {
        const { className } = this.props;
        const cls = classNames([
            styles.panel,
            className
        ]);
        const title = this.renderHeader();
        const content = this.renderContent();

        return (
            <div className={cls}>
                { title }
                <CSSTransitionGroup
                    transitionName="height-animation"
                    transitionEnterTimeout={ANIMATION_TIMEOUT}
                    transitionLeaveTimeout={ANIMATION_TIMEOUT}>
                    { content }
                </CSSTransitionGroup>
            </div>
        );
    }
 }

export default Panel;