import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';

import DropDownOption from 'components/DropDownOption';
import Icon from 'components/Icon';
import ToolTip from 'components/ToolTip';

import Keys from 'constants/keys';
import classNames from 'utils/classNames';
import styles from './DropDownList.scss';

@observer
class DropDownList extends Component {
    @observable expanded = false;
    @observable value = '';
    @observable title = '';
    @observable isValid = true;
    @observable isErrorVisible = false;
    @observable errorMessage = '';
    
    defaultValue = '';
    element = null;
    isActive = false;
    optionsLength = '';
    titlesMap = {};
    
    static propTypes = {
        classNames: PropTypes.string,
        errorMessage: PropTypes.string,
        expanded: PropTypes.bool,
        isForm: PropTypes.bool,
        isRequired: PropTypes.bool,
        placeholder: PropTypes.string,
        selectedValue: PropTypes.string,
        type: PropTypes.string,
        onChange: PropTypes.func
    }
    
    componentWillMount() {
        const { children } = this.props;
        
        this.initTitlesMap(children);
    }
    
    componentDidMount() {
        const { children, placeholder, selectedValue } = this.props;
        
        this.setValue(selectedValue,children, placeholder);
        this.defaultValue = selectedValue;
        this.bindListeners();
    }
    
    componentWillUpdate(nextProps) {
        const { children, placeholder } = nextProps;
        const selectedValue = nextProps.selectedValue !== this.props.selectedValue ? nextProps.selectedValue : this.value;
        
        this.initTitlesMap(children);
        this.setValue(selectedValue,children,placeholder);
    }
    
    componentWillUnmount() {
        this.releaseListeners();
    }
    
    initTitlesMap(options) {
        options.forEach(option => {
            this.titlesMap[option.props.value] = option.props.children;
            
            if(option.props.options){
                option.props.options.forEach(childOption => {
                    this.titlesMap[childOption.value] = childOption.title;
                });
            }
        });
    }
    
    bindListeners() {
        document.addEventListener('mousedown', this.handleDocumentClick, false);
        document.addEventListener('touchstart', this.handleDocumentClick, false);
    }
    
    releaseListeners() {
        document.removeEventListener('mousedown', this.handleDocumentClick);
        document.removeEventListener('touchstart', this.handleDocumentClick);
    }
    
    @action setValue(value, children, placeholder) {
        this.value = value;
        this.title = this.titlesMap[value] ? this.titlesMap[value] : placeholder;
    }
    
    reset() {
        const { defaultValue, props } = this;
        const { children, placeholder } = props;
        
        this.isValid = true;
        this.setValue(defaultValue,children,placeholder);
    }
    
    validate() {
        const { errorMessage, isRequired } = this.props;
        
        if(isRequired && !this.value) {
            this.errorMessage = errorMessage;
            return false;
        }
        
        this.errorMessage = '';
        return true;
    }
    
    @autobind handleDocumentClick(event) {
        const { target } = event;
        const { element } = this;
        
        if(element.contains(target)){
            return false;
        }
        this.expanded = false;
        this.isActive = false;
        this.isErrorVisible = false;
    }
    
    @autobind handleInputClick(event) {
        event.stopPropagation();
        event.preventDefault();
        
        this.expanded = true;
    }
    
    @autobind handleAnchorClick(event) {
        event.preventDefault();
    }
    
    @autobind handleBlur() {
        this.isActive = false;
        this.isErrorVisible = false;
    }
    
    @autobind handleFocus() {
        this.isActive = true;
        this.isErrorVisible = !this.isValid && (this.errorMessage !== '');
    }
    
    @autobind handleOptionClick(event, value, title) {
        event.stopPropagation();
        const { isActive, props } = this;
        const { onChange } = props;
        
        this.title = title;
        this.value = value;
        this.expanded = false;
        this.isValid = this.validate();
        this.isErrorVisible = !this.isValid && isActive && (this.errorMessage !== '');
        
        if(onChange) {
            onChange(event,value,title,this.isValid);
        }
    }
    
    @autobind onKeyPressedOption(event, index) {
        if(index === 0 && event.shiftKey && event.keyCode === Keys.TAB) {
            this.expanded = false;
        }
        if(event.keyCode === Keys.ESC) {
            this.expanded = false;
            this.refs.dropdown.focus();
        }
        if(index === this.optionsLength -1 && event.keyCode === Keys.TAB && !event.shiftKey) {
            event.preventDefault();
            this.expanded = false;
            this.refs.dropdown.focus();
        }
    }
    
    @autobind onKeyPressedList(event) {
        if (event.keyCode === Keys.SPACE_BAR) {
            event.preventDefault();
            this.expanded = true;
        }
    }
    
    renderInput() {
        const { isValid, props, title } = this;
        const { isForm, type } = props;
        
        const cls = classNames([
            styles.dropDownSelect,
            !isValid ? styles.error : '',
            (type === 'navigation') ? styles.dropDownSelectDark : styles.dropDownSelectLight,
            isForm ? styles.isForm : ''
        ]);
        
        // const expandStatus = this.expanded ? ', closes menu' : ', opens menu';
        
        return(
            <div className={styles.dropdownList} onClick={event => this.handleInputClick(event)}>
                <a href="" className={cls} ref="dropdown"
                   onClick={this.handleAnchorClick}
                   onKeyDown={this.onKeyPressedList}
                   onBlur={this.handleBlur} onFocus={this.handleFocus}>
                    { title }
                </a>
                <Icon type="chevron-down" className={styles.dropDownArrow} />
            </div>
        );
    }

    renderOptions() {
        const { children, type } = this.props;

        const options = children.map((child,index) => {
            const { props } = child;
            return (
                <DropDownOption {...props}
                    type={type}
                    key={index}
                    focused={index === 0}
                    optionsExpanded={props.optionsExpanded}
                    selectedValue={this.value}
                    index={index}
                    optionLength={this.optionsLength}
                    onKeyDown={event => this.onKeyPressedOption(event,index)}
                    onClick={this.handleOptionClick} />
            );
        });

        this.optionsLength = options.length;
        const cls = classNames([
            styles.options,
            type === 'navigation' ? styles.darkbg : styles.lightbg,
            (options.length > 10 && type !== 'navigation') ? styles.fixedHeight : ''
        ]);

        if(this.expanded) {
            return (
                <ul type={type} className={cls} >
                    { options }
                </ul>
            );
        }
        return null;
    }

    renderToolTip() {
        const { errorMessage, isErrorVisible } = this;
        return isErrorVisible ? (
            <ToolTip
                className={styles.dropdownErrorTooltip}
                isCloseVisible={false}
                position="top"
                target={this.element}
                visible={isErrorVisible}>
                { errorMessage }
            </ToolTip>
        ) : null;
    }

    render() {
        const { className } = this.props;
        const input = this.renderInput();
        const options = this.renderOptions();
        const tooltip = this.renderToolTip();

        const cls = classNames([
            styles.dropDown,
            className
        ]);

        return (
            <div className={cls} ref={element => (this.element = element)}>
                { input }
                { options }
                { tooltip }
            </div>
        );
    }
}

export default DropDownList;