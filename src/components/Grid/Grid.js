import React, { Component, PropTypes } from 'react';
import { action, observable } from 'mobx';
import { observer, propTypes as ObservableTypes } from 'mobx-react';
import autobind from 'autobind-decorator';

import classNames from 'utils/classNames';
import { isZeroToSmall } from 'utils/breakpoints';
import styles from './Grid.scss';

import GridHeader from './GridHeader';
import GridRow from './GridRow';

@observer
class Grid extends Component {
    @observable isMobile = false;
    @observable columns = [];
    @observable data = [];

    static propTypes = {
        bodyClassName: PropTypes.string,
        classNames: PropTypes.string,
        collapsedIconTitle: PropTypes.string,
        columns: PropTypes.oneOfType([
            ObservableTypes.observableArray,
            PropTypes.array
        ]).isRequired,
        data: PropTypes.oneOfType([
            ObservableTypes.observableArray,
            PropTypes.array
        ]),
        detailsRenderer: PropTypes.func,
        expandable: PropTypes.bool,
        expandedClassName: PropTypes.string,
        expandedIconTitle: PropTypes.string,
        headerClassName: PropTypes.string,
        onExpand: PropTypes.func,
        onProps: PropTypes.func
    }

    static defaultProps = {
        expandable:false,
        expanded: false
    }

    componentWillMount() {
        const { columns, data } = this.props;
        this.setColumns(columns);
        this.setData(data,false);

        this.columns.forEach((columns,index) => {
            columns.index = index;
         });

        this.isMobile = isZeroToSmall();
    }

    componentWillReceiveProps(nextProps) {
        this.setColumns(nextProps.columns);
        this.setData(nextProps.data);
    }

    componentWillUnmount() {
        window.removeEventListener('resize',this.handleWindowResize);
    }

    componentDidMount() {
        window.addEventListener('resize',this.handleWindowResize);
    }

    @action setColumns(columns) {
        this.columns = columns;
    }

    @action setData(data, isDataSortNeeded = true) {
        const { columns } = this;
        this.data = data;

        if(isDataSortNeeded) {
            columns.some(column => {
                if(column.sorted) {
                    this.sortData(column);
                    return true;
                }
                return false;
            });
        }
    }

    @action sortData(column) {
        const { columns, data } = this.props;

        columns.some(currentColumn => {
            if(currentColumn.sorted && column.field !== currentColumn.field) {
                currentColumn.sorted = false;
                return true;
            }
            return false;
        });

        const compareFn = (item1, item2) => {
            if(column.sortFunction) {
                return column.sortFunction(item1,item2,column.sortOrder);
            }

            const value1 = item1[column.field];
            const value2 = item2[column.field];
            if(value1 < value2) {
                return column.sortOrder;
            }
            else if (value1 > value2) {
                return 0 - column.sortOrder;
            }
            return 0;
        };

        this.data = data.sort(compareFn);
    }

    @autobind toggleDetails(event) {
        event && event.stopPropagation();

        const { data, onExpand } = this.props;
        this.expanded = !this.expanded;

        if(onExpand) {
            onExpand(this.expanded,data);
        }
    }

    @autobind handleWindowResize() {
        this.isMobile = isZeroToSmall();
    }

    @autobind handleSort(column) {
        const { props } = this;
        const { onSort } = props;

        this.sortData(column);

        if(onSort) {
            onSort(column);
        }
    }

    renderHeader() {
        const { columns } = this;
        const { headerClassName, expandable } = this.props;
        const headerProps = {
            classNames: headerClassName,
            columns,
            expandable,
            onSort: this.handleSort
        };

        return(
            <GridHeader {...headerProps} />
        );
    }

    renderRow(item,key) {
        const { columns } = this;
        const { collapsedIconTitle, detailsRenderer, expandable, expandedClassName, expandedIconTitle, onExpand } = this.props;

        const rowProps = {
            collapsedIconTitle,
            columns,
            data: item,
            detailsRenderer,
            expanded: item.expanded,
            expandable: item.expandable ? item.expandable : false,
            expandedClassName,
            expandedIconTitle,
            isGridExpandable: expandable,
            onExpand
        };

        return(
            <GridRow key={key} {...rowProps} />
        );
    }

    renderBody() {
        const { data } = this;
        const columnsCount = this.columns.length + 1;

        let rows = null;

        if(data && data.length) {
            rows = data.map((item,index) => {
                return this.renderRow(item,index);
            });
        }
        else {
            rows = (
                <tbody>
                    <tr>
                        <td colSpan={columnsCount} className={styles.noDataMessage}>NO ITEM TO DISPLAY</td>
                    </tr>
                </tbody>
            );
        }
        return rows;
    }

    render() {
        const { className } = this.props;
        const header = this.renderHeader();
        const body = this.renderBody();

        const cls = classNames([
            styles.grid,
            className
        ]);
        let content;
        if(this.isMobile) {
            content = (
                <div>
                    { body }
                </div>
            );
        }
        else {
            content = (
                <table className={styles.gridTable}>
                    { header }
                    { body }
                </table>
            );
        }

        return (
            <div className={cls}>
                { content }
            </div>
        );
    }
}

export default Grid;