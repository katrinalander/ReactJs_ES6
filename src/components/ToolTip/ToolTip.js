import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { findDOMNode } from 'react-dom';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import Icon from 'components/Icon';

import classNames from 'utils/classNames';

import styles from './ToolTip.scss';
import { isZeroToExtraSmall, isZeroToSmall } from 'utils/breakpoints';

const ToolTipPosition = {
    TOP: 'top',
    BOTTOM: 'bottom',
    LEFT: 'left',
    RIGHT: 'right'
};

const LEFT_SPACE = 50;
const ARROW_TOP = 50;
const V_WHITE_SPACE = 10;
const H_WHITE_SPACE = 5;

@observer
class ToolTip extends Component {
    @observable top = -1;
    @observable left = 0;
    @observable isVisible = false;
    @observable position = ToolTipPosition.RIGHT;

    elementToolTip = null;

    static propTypes = {
        className: PropTypes.string,
        isCloseVisible: PropTypes.bool,
        position: PropTypes.oneOfType([
            ToolTipPosition.TOP,
            ToolTipPosition.BOTTOM,
            ToolTipPosition.LEFT,
            ToolTipPosition.RIGHT
        ]),
        target: PropTypes.object,
        visible: PropTypes.bool,
        onClose: PropTypes.func
    }

    static defaultProps = {
        isCloseVisible: true,
        position: ToolTipPosition.RIGHT,
        visible: false
    }

    componentWillMount() {
        const { position,visible } = this.props;

        this.position = position;
        this.isVisible = visible;
    }

    componentDidMount() {
        const { isVisible } = this;

        if (isVisible) {
            this.bindListeners();
            this.getTargetPosition();
        }
    }

    componentWillUnmount() {
        this.releaseListeners();
    }

    componentWillUpdate(nextProps) {
        const nextVisible = nextProps.visible;
        const prevVisible = this.props.visible;

        const nextPosition = nextProps.position;
        const prevPosition = this.props.position;

        if (nextVisible !== prevVisible) {
            this.isVisible = nextVisible;
        }
        if (nextPosition !== prevPosition) {
            this.position = nextPosition;
        }
    }

    shouldComponentUpdate(nextProps) {
        const nextVisible = nextProps.visible;
        const prevVisible = this.props.visible;
        const nextChildren = nextProps.children;
        const prevChildren = this.props.children;
        const nextPosition = nextProps.position;
        const prevPosition = this.props.position;

        return (
            nextVisible !== prevVisible ||
            nextChildren !== prevChildren ||
            nextPosition !== prevPosition
        );
    };

    componentDidUpdate(prevProps) {
        const prevVisible = prevProps.visible;
        const nextVisible = this.isVisible;
        if (nextVisible !== prevVisible) {
            if (nextVisible) {
                this.getTargetPosition();
                this.bindListeners();
            }
            else {
                this.releaseListeners();
            }
        }
    };

    @autobind handleToolTipClose(event) {
        event.stopPropagation();
        const { target, onClose } = this.props;

        this.isVisible = false;

        if (target && target.children) {
            target.children[0] && target.children[0].focus();
        }

        if (onClose) {
            onClose(event);
        }
    }

    @autobind handleEscClose(event) {
        if (event.keyCode === 27) {
            const { onClose } = this.props;

            this.isVisible = false;

            if (onClose) {
                onClose(event);
            }
        }
    }

    @autobind handleFocus(id) {
        const child = this.refs[id];
        if (child) {
            const button = child.refs.button;
            button.focus();
        }
    }

    bindListeners() {
        document.addEventListener('scroll', this.handleToolTipClose);
        document.addEventListener('keydown', this.handleEscClose);
        document.addEventListener('mousedown', this.handleDocumentClick, false);
        document.addEventListener('touchstart', this.handleDocumentClick, false);
        window.addEventListener('resize', this.handleResize, false);
    }

    releaseListeners() {
        document.removeEventListener('scroll', this.handleToolTipClose);
        document.removeEventListener('keydown', this.handleEscClose);
        document.removeEventListener('mousedown', this.handleDocumentClick);
        document.removeEventListener('touchstart', this.handleDocumentClick);
        window.removeEventListener('resize', this.handleResize);
    }

    getTargetPosition() {
        const { position } = this;
        const { target } = this.props;
        const parent = findDOMNode(target);
        const elementTT = findDOMNode(this.elementToolTip);

        if(!parent) {
            return;
        }

        let left, top;
        const elementHeight = elementTT.clientHeight;
        const elementWidth = elementTT.clientWidth;
        const parentPosition = parent.getBoundingClientRect();
        const parentRelativePosition = this.getRelativeParent(target).getBoundingClientRect();

        switch (position) {
            case ToolTipPosition.TOP:
                top = parentPosition.top - elementHeight - V_WHITE_SPACE;
                if (isZeroToExtraSmall()) {
                    left = 0;
                }
                else if (isZeroToSmall()) {
                    left = (document.documentElement.offsetWidth - elementWidth) / 2;
                }
                else if (target.offsetLeft + elementWidth < document.documentElement.offsetWidth) {
                    left = parentPosition.left + (parentPosition.width / 2) - (elementWidth / 2);
                    if (left < 0) {
                        left = target.parentElement.offsetLeft;
                    }
                }
                else {
                    left = (document.documentElement.offsetWidth - elementWidth);
                }
                break;
            case ToolTipPosition.BOTTOM:
                top = parentPosition.top + ((parentPosition.height + ARROW_TOP) / 2 );
                if (isZeroToExtraSmall()) {
                    left = 0;
                }
                else if (isZeroToSmall()) {
                    left = (document.documentElement.offsetWidth - elementWidth) / 2;
                }
                else if (target.offsetLeft + elementWidth < document.documentElement.offsetWidth) {
                    left = target.offsetLeft - LEFT_SPACE;
                }
                else {
                    left = (document.documentElement.offsetWidth - elementWidth);
                }
                break;
            case ToolTipPosition.LEFT:
                top = parentPosition.top + ((parentPosition.height - ARROW_TOP) / 2);
                left = parentPosition.left - elementWidth - H_WHITE_SPACE;
                break;
            case ToolTipPosition.RIGHT:
                top = parentPosition.top + ((parentPosition.height - ARROW_TOP) / 2);
                left = parentPosition.left + parentPosition.width + H_WHITE_SPACE;
                break;

            default:
                top = parentPosition.top + ((parentPosition.height - elementHeight) / 2);
                left = parentPosition.left + parentPosition.width;
                break;
        }

        this.left = left - parentRelativePosition.left;
        this.top = top - parentRelativePosition.top;
    }

    getParentByStyle(target, styleProps, styleValues) {
        let parent = findDOMNode(target);

        while (parent && parent.nodeType === 1) { // if parent is element
            let style = null;

            style = getComputedStyle(parent);
            const testValue = styleProps.reduce((value,key) => value + style[key], '');

            if (style) {
                if (styleValues.test(testValue)) {
                    return parent;
                }
            }

            parent = parent.parentNode;
        }
        return document.body;
    }

    getScrollParent(target) {
        return this.getParentByStyle(target, ['overflow','overflowX','overflowY'], /(auto|scroll)/);
    }

    getRelativeParent(target) {
        return this.getParentByStyle(target, ['position'], /(relative|absolute)/);
    }

    @autobind handleDocumentClick(event) {
        const { elementToolTip} = this;
        const { onClose } = this.props;

        if (onClose) {
            onClose(event);
        }
        if(elementToolTip) {
            return;
        }
    }

    @autobind handleMouseDown(event) {
        const { nativeEvent } = event;
        event.stopPropagation();
        nativeEvent.stopImmediatePropagation();
    }

    @autobind setReference(element) {
        this.elementToolTip = element;
        if (element && this.top !== -1) {
            this.handleFocus('iclose');
        }
    }

    @autobind handleResize() {
        this.getTargetPosition();
    }

    render() {
        const { left, top, isVisible } = this;
        const { children, className, isCloseVisible, position, target } = this.props;

        const cls = classNames([
            styles.tooltip,
            styles[position],
            className
        ]);

        const positionStyle = {
            left,
            top
        };

        const icon = isCloseVisible ? (
            <Icon
                className={styles.close}
                type="X"
                ref="iclose"
                tabIndex="-1"
                onClick={this.handleToolTipClose} />
        ) : null;

        const Div = (target && (position === 'bottom' || position === 'top')) ? styled.div`
        &:after {
            left: ${target.offsetLeft - left + (target.offsetWidth / 2)}px;
        }` : styled.div``;

        return isVisible ? (
            <Div
                className={cls}
                style={positionStyle}
                ref={this.setReference}
                onMouseDown={this.handleMouseDown}>
                { children }
                { icon }
            </Div>
        ) : null;
    }
}


export default ToolTip;