import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import Icon from 'components/Icon';
import ToolTip from 'components/ToolTip';

import { isZeroToSmall } from 'utils/breakpoints';

import styles from './Annotation.scss';

@observer
class Annotation extends Component {
    @observable isAnnotationVisible = false;
    @observable currentPosition = 'bottom';

    element = null;

    static propTypes = {
        className: PropTypes.string,
        content: PropTypes.element.isRequired,
        position: PropTypes.string,
        title: PropTypes.string
    }

    componentDidMount() {
        window.addEventListener('resize',this.handleResize);
    }

    componentWillMount() {
        window.removeEventListener('resize',this.handleResize);
    }

    checkDemensions() {
        if (this.props && this.props.position) {
            this.currentPosition = this.props.position;
        }
        else {
            this.currentPosition = (isZeroToSmall()) ? 'bottom' : 'right';
        }
    }

    @autobind handleResize() {
        this.checkDemensions();
    }

    @autobind handleClickInfoIcon(event) {
        event.stopPropagation();
        if(this.props.position) {
            this.currentPosition = this.props.position;
        }
        else {
            this.currentPosition = (isZeroToSmall()) ? 'bottom' : 'right';
        }
        this.isAnnotationVisible = true;
    }

    @autobind handleCloseToolTip() {
        this.isAnnotationVisible = false;
    }

    @autobind setReference(element) {
        this.element = element;
    }

    render() {
        const { isAnnotationVisible, props, currentPosition } = this;
        const { content, title, className } = props;

        return (
            <span ref={this.setReference} className={className}>
                <Icon
                    type="info2"
                    classNames={styles.infoIcon}
                    hoverClassName={styles.infoIconHover}
                    onClick={this.handleClickInfoIcon} />
                <ToolTip
                    target={this.element}
                    visible={isAnnotationVisible}
                    position={currentPosition}
                    onClose={this.handleCloseToolTip}>
                    { content }
                </ToolTip>
            </span>
        );
    }
};
 export default Annotation;