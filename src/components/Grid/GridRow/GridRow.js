import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, propTypes as ObservableTypes } from 'mobx-react';
import autobind from 'autobind-decorator';

import GridCell from 'components/Grid/GridCell';
import Icon from 'components/Icon';

import classNames from 'utils/classNames';
import { isZeroToSmall } from 'utils/breakpoints';
import styles from './GridRow.scss';

@observer
class GridRow extends Component {
    @observable expanded = false;
    @observable isMobile = false;

    static propTypes = {
        collapsedIconTitle: PropTypes.string,
        columns: PropTypes.oneOfType([
            ObservableTypes.observableArray,
            PropTypes.array
        ]).isRequired,
        data: PropTypes.oneOfType([
            ObservableTypes.observableObject,
            PropTypes.object
        ]).isRequired,
        detailsRenderer: PropTypes.func,
        expandable: PropTypes.bool,
        expanded: PropTypes.bool,
        expandedClassName: PropTypes.string,
        expandedIconTitle: PropTypes.string,
        isGridExpandable: PropTypes.bool.isRequired,
        onExpand: PropTypes.func
    };

    static defaultProps = {
        expanded: false,
        expandable: false
    };

    componentWillMount() {
        const { expanded } = this.props;
        this.expanded = expanded;
        this.isMobile = isZeroToSmall();
    }

    componentWillReceiveProps(nextProps) {
        const { expanded } = nextProps;
        this.expanded = expanded;
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    @autobind toggleDetails(event) {
        event && event.stopPropagation();
        const { data, onExpand } = this.props;
        this.expanded = !this.expanded;
        if(onExpand) {
            onExpand(this.expanded, data);
        }
    }

    @autobind handleWindowResize() {
        this.isMobile = isZeroToSmall();
    }

    renderCells(data) {
        const { isMobile, props } = this;
        const { collapsedIconTitle, columns, expandable, expandedIconTitle, isGridExpandable } = props;
        const cells = columns.map((column, index) => {
            let renderer = null;
            if(column.renderer) {
                if(column.renderer instanceof Function) {
                    renderer = column.renderer;
                }
                if(column.renderer instanceof Array) {
                    const rendererIndex = data.rendererIndex || 0;
                    renderer = column.renderer[rendererIndex];
                }
            }
            const content = renderer && renderer(data, data[column.field]) || data[column.field];
            const className = column.className || '';

            return(
                <GridCell key={index} className={className} title={column.title}>
                    { content }
                </GridCell>
            );
        });

        if(isGridExpandable) {
            const iconCls = classNames([
                styles.rowExpanderIcon,
                this.expanded ? styles.expanded : styles.collapsed
            ]);
            const iconText = isMobile ? this.expanded ? (
                <span className={styles.rowExpanderLinkSpan} onClick={event => {
                this.toggleDetails(event);
                }}>
                    { collapsedIconTitle }
                </span>
            ) : (
                <span className={styles.rowExpanderLinkSpan} onClick={event => {
                    this.toggleDetails(event);
                }}>
                    { collapsedIconTitle }
                </span>
            ) : null;
            
            const icon = expandable ? (
                <span className={styles.rowExpanderLink}>
                    <Icon type="chevron-down" className={iconCls} onClick={event => this.toggleDetails(event)} />
                    { iconText }
                </span>
            ) : null;

            if(isMobile && expandable) {
                cells.push(
                    <GridCell key={-1} className={styles.rowExpandableCell}>
                        { icon }
                    </GridCell>
                );
            }
            else {
                cells.unshift(
                    <GridCell key={-1} className={styles.rowExpandableCell}>
                        { icon }
                    </GridCell>
                );
            }
        }

        return cells;
    }

    renderDetails(data) {
        const { expanded } = this;
        const { columns, expandable, detailsRenderer } = this.props;
        let mobile = this.isMobile;

        if(expanded) {
            const content = detailsRenderer && detailsRenderer(data) || null;
            if(mobile) {
                return (
                    <div>
                        { content }
                    </div>
                );
            }
            return (
                <td colSpan={expandable ? columns.length + 1 : columns.length} style={{width:'100%'}}>
                    { content }
                </td>
            );
        }
        return null;
    }

    render() {
        const { expanded } = this;
        const { expandable, expandedClassName, data, isGridExpandable } = this.props;
        const cells = this.renderCells(data);
        const details = this.renderDetails(data);
        let trs, rowContent;
        const cls = classNames([
            expanded ? styles.expanded : styles.row,
            expanded && expandedClassName ? expandedClassName : ''
        ]);
        if(expanded) {
            if(this.isMobile) {
                trs = (
                    <dd className={styles.detailsDef}>
                        { details }
                    </dd>
                );
            }
            else {
                trs = (
                    <tr className={styles.rowDetails}>
                        { details }
                    </tr>
                );
            }
        }
        else {
            trs = null;
        }
        if(this.isMobile) {
            rowContent = (
                <dl className={styles.gridDefList}>
                    { cells }
                    { trs }
                </dl>
            );
        }
        else {
            rowContent = (
                <tbody>
                    <tr className={cls} onClick={event => {
                        if(expandable && isGridExpandable) {
                            this.toggleDetails(event);
                        }
                    }}>
                        { cells }
                    </tr>
                    { trs }
                </tbody>
            );
        }
        return rowContent;
    }
}

export default GridRow;