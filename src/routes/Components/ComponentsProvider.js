import React, { Component } from 'react';

import Components from './Components';
import componentsViewModel from './ComponentsViewModel.js';

class ComponentsProvider extends Component {
    constructor(props, content) {
        super(props, content);

        this.deps = {
            viewModel: componentsViewModel.create()
        };
    }

    render() {
        return (
            <Components {...this.deps} {...this.props} />
        )
    }
}

export default ComponentsProvider;