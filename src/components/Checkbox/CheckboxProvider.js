import React, { Component } from 'react';

import Checkbox from './Checkbox';
import CheckboxViewModel from './CheckboxViewModel';

class CheckboxProvider extends Component {
    constructor(props, content) {
        super(props, content);

        this.deps = {
            viewModel: CheckboxViewModel.create()
        };
    }

    render() {
        return(
            <Checkbox {...this.deps} {...this.props} />
        );
    }
}
export default CheckboxProvider;