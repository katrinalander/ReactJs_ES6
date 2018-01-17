import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import autobind from 'autobind-decorator';

import Icon from 'components/Icon';

import Keys from 'constants/keys';

import classNames from 'utils/classNames';
import styles from './DropDownOption.scss';

@observer
class DropDownOption extends Component {
    element = null;
    @observable expanded = true;

    static propTypes = {
        classNames: PropTypes.string,
        focused: PropTypes.bool,
        hoverClassName: PropTypes.string,
        index: PropTypes.number,
        optionLength: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
        options: PropTypes.array,
        optionsExpanded: PropTypes.bool,
        selectedClassName: PropTypes.string,
        selectedValue: PropTypes.string,
        type: PropTypes.string,
        value: PropTypes.string.isRequired,
        onClick: PropTypes.func,
        onKeyDown: PropTypes.func
    }

    static defaultProps = {
        selectedValue: ''
    }

    componentWillMount() {
        this.expanded = this.props.optionsExpanded;
    }

    componentDidMount() {
        const { focused } = this.props;

        if(focused) {
            this.element.focus();
        }
    }

    isSelected(value) {
        const { selectedValue } = this.props;

        return value === selectedValue;
    }

    @autobind
    handleClick(event, value, title, options) {
        event.preventDefault();

        const { onClick } = this.props;

        if(options && options.length) {
            this.expanded = !this.expanded;
            return false;
        }

        if(onClick) {
            onClick(event, value, title);
        }
    }

    @autobind
    onKeyPressed(event, options) {
        const { onKeyDown } = this.props;
        if ((event.keyCode === Keys.SPACE_BAR || event.keyCode === Keys.ENTER) && options && options.length) {
            this.expanded = !this.expanded;
            return false;
        }

        if(onKeyDown) {
            onKeyDown(event);
        }
    }

    renderOptionTitle(children, value, options) {
        const { selectedClassName, className, type, index, optionLength } = this.props;

        const isSelected = this.isSelected(value);

        const cls = classNames([
            styles.dropDownOption,
            className,
            isSelected ? styles.selected : '',
            isSelected ? selectedClassName : '',
            (type === 'navigation') ? styles.darkbg : styles.lightbg
        ]);

        //const selectedStatus = isSelected ? ', selected' : '';
        //const optionStatus = `${index + 1} of ${optionLength} items`;
        const optionName = isSelected ? <strong> {children} </strong> : `${children}`;
        const iconType = this.expanded ? 'chevron-down' : 'chevron-right';
        const expander = options && options.length ? (
            <Icon type={iconType} className={styles.dropDownOptionExpander} />
        ) : null;

        return (
            <a className={cls}
               href=""
               ref={element => (this.element = element)}
               value={value}
               onClick={event => this.handleClick(event, value, children, options)}
               onKeyDown={event => this.onKeyPressed(event, options)} >
                { optionName }
                { expander }
            </a>
        );
    }

    renderChildOptions(options) {
        if(options) {
            const elements = options.map((options, index) => {
                const { title, value } = options;
                const optionTitle = this.renderOptionTitle(title, value);

                return (
                    <li className={styles.dropDownOptionContainer} key={index}>
                        { optionTitle }
                    </li>
                );
            });

            return this.expanded ? (
                <ul className={styles.dropDownOptionsContainer}>
                    { elements }
                </ul>
            ) : null;
        }
        return null;
    }

    render() {
        const { options, children, value } = this.props;

        const optionTitle = this.renderOptionTitle(children, value, options);
        const childOptions = this.renderChildOptions(options);

        return (
            <li className={styles.dropDownOptionContainer}>
                { optionTitle }
                { childOptions }
            </li>
        );
    }
}

export default DropDownOption;