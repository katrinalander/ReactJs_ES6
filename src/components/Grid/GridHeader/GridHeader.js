import React, { Component, PropTypes } from 'react';
import { observable, action } from 'mobx';
import { observer, propTypes as ObservableTypes } from 'mobx-react';
import autobind from 'autobind-decorator';

import Icon from 'components/Icon';
import GridCell from 'components/Grid/GridCell';

import classNames from 'utils/classNames';
import { isZeroToSmall } from 'utils/breakpoints';
import styles from './GridHeader.scss';
import Keys from 'constants/keys';

@observer
class GridHeader extends Component {
    @observable isMobile = false;
    @observable columns = '';

    static propTypes = {
        className: PropTypes.string,
        columns: PropTypes.oneOfType([
            ObservableTypes.observableArray,
            PropTypes.array
        ]).isRequired,
        expandable: PropTypes.bool.isRequired,
        onSort: PropTypes.func
    }

    componentWillMount() {
        this.isMobile = isZeroToSmall();
        this.setColumns(this.props.columns);
    }
    componentWillReceiveProps(nextProps) {
        this.setColumns(nextProps.columns);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }
    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize);
    }

    @action setColumns(columns) {
        this.columns = columns;
    }
    @autobind handleWindowResize() {
        this.isMobile = isZeroToSmall();
    }
    @autobind handleHeaderClick(column) {
        this.handleSort(column);
    }
    @autobind handleHeaderKeyDown(event, column) {
        if (event.keyCode === Keys.SPACE_BAR || event.keyCode === Keys.ENTER) {
            event.preventDefault();
            this.handleSort(column);
        }
    }
    @autobind handleSort(column) {
        const { columns, onSort } = this.props;
        columns.forEach(col => {
            if(column !== col) {
                col.sortOrder = 1;
            }
        });
        column.sorted = true;
        column.sortOrder *= -1;

        if(onSort) {
            onSort(column);
        }
    }

    @autobind renderColumns() {
        const { columns, isMobile } = this;
        const { expandable } = this.props;

        const cells = columns.map((column,index) => {
            const title = column.headRenderer && column.headRenderer(column.title, column) || column.title;
            const clsName = classNames([
                styles.headerContainer,
                column.sortable ? styles.headerSortableContainer : '',
                column.sorted ? styles.headerSortedContainer : '',
                column.className
            ]);

            if(isMobile) {
                return(
                    <dt className={clsName} key={index}>{ title }</dt>
                );
            }

            const sortOrderLabel = column.sorted ? column.sortOrder === -1 ? 'sort to high' : 'sort to low' : 'not sorted';
            const iconType = column.sorted ? column.sortOrder === -1 ? 'chevron-up' : 'chevron-down' : 'play';

            const content = column.sortable || column.sorted ? (
                <span>
                    { title }
                    { '\ea1c'}
                    <Icon type={iconType} className={styles.iconSort} />
                </span>
            ) : title;

            const props = column.sortable ? {
                role: 'button',
                tabIndex: 0,
                onClick: () => {
                    this.handleHeaderClick(column);
                },
                onKeyDown: event => {
                    this.handleHeaderKeyDown(event, column);
                }
            } : {};

            return (
                <th className={clsName} key={index} {...props}> { content } </th>
            );
        });

        if(expandable) {
            cells.unshift(
                <GridCell key={-1} className={styles.headerExpandableCell} />
            );
        }

        return cells;
    }

    render() {
        const columns = this.renderColumns();

        if(!this.isMobile) {
            return(
                <thead className={styles.header}>
                    <tr>
                        { columns }
                    </tr>
                </thead>
            );
        }
        return null;
    }
}

export default GridHeader;