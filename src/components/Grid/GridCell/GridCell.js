import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import autobind from 'autobind-decorator';

import classNames from 'utils/classNames';
import { isZeroToSmall } from 'utils/breakpoints';
import styles from './GridCell.scss';

@observer
class GridCell extends Component {
    @observable isMobile = false;

    static propTypes = {
        className: PropTypes.string,
        title: PropTypes.string
    };

    componentWillMount() {
        this.isMobile = isZeroToSmall();
    }
    componentWillUnmount() {
        window.removeEventListener('resize',this.handleWindowResize);
    }
    componentDidMount() {
        window.addEventListener('resize',this.handleWindowResize);
    }

    @autobind handleWindowResize() {
        this.isMobile = isZeroToSmall();
    }

    render() {
        const { children, className, title } = this.props;
        const clsCell = classNames([
            styles.cell,
            className
        ]);
        let dtClassName = styles.list;
        if(className.includes('cell-checkbox')) {
            dtClassName = styles.checkbox;
        }
        let rowContent;
        if(this.isMobile) {
            rowContent = (children) ? (
                <div className={dtClassName}>
                    <dt>{ title }</dt>
                    <dd>{ children }</dd>
                </div>
            ) : null;
        }
        else {
            rowContent = (
                <td className={clsCell}>{ children }</td>
            );
        }
        return rowContent;
    }
}

export default GridCell;