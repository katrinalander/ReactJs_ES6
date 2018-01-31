import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import { propTypes as ObservableTypes } from 'mobx-react';

import QuickNavigationMap from 'constants/quickNavigation';

import DropDownList from 'components/DropDownList';
import DropDownOption from 'components/DropDownOption';

import classNames from 'utils/classNames';
import styles from './QuickNavigation.scss';

class QuickNavigation extends Component {
    static propTypes = {
        className: PropTypes.string,
        entitlements: PropTypes.oneOfType([
            ObservableTypes.observableArray,
            PropTypes.array
        ]),
        placeholder: PropTypes.string,
        onChange: PropTypes.func
    }

    @autobind handleChange(event, value) {
        const { onChange } = this.props;

        if(onChange) {
            onChange(event, value);
        }
    }

    renderOptions() {
        const { entitlements } = this.props;
        const result = [];

        QuickNavigationMap.forEach((link,index) => {
            let options = [];

            link.options && link.options.forEach(option => {
                // if(entitlements.some(entitlement => entitlement === option.entitlement)) {
                    options.push({
                        value: option.value,
                        title: option.title
                    });
                // }
            });

            // if(!link.entitlement && options.length){ // || (link.entitlement && entitlements.some(entitlement => entitlement === link.entitlement))) {
                result.push(
                    <DropDownOption value={link.value} key={index} options={options} optionsExpanded={true}>
                        { link.title }
                    </DropDownOption>
                );
            // }
        });

        return result;
    }

    render() {
        const { className, placeholder } = this.props;

        const cls = classNames([
            styles.quickNavigationContainer,
            className
        ]);

        const options = this.renderOptions();

        return(
            <div className={cls}>
                <DropDownList placeholder={placeholder} type="navigation" onChange={this.handleChange}>
                    { options }
                </DropDownList>
            </div>
        );
    }
}

export default QuickNavigation;