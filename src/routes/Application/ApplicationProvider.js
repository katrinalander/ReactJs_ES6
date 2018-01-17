import React, { Component } from 'react';

import Application from '../Application/Application.js';
import applicationViewModel from '../Application/ApplicationViewModel.js';

class ApplicationProvider extends Component {
    constructor(props, content) {
        super(props, content);

        this.deps = {
            viewModel: applicationViewModel.create()
        }
    }

    render() {
        return (
            <Application {...this.deps} {...this.props} />
        );
    }
}

export default ApplicationProvider;