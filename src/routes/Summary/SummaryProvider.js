import React, { Component } from 'react';

import Summary from './Summary';
import SummaryViewModel from './SummaryViewModel';

class SummaryProvider extends Component {
    constructor(props, content) {
        super(props, content);

        this.deps = {
            viewModel: SummaryViewModel.create()
        };
    }

    render() {
        return (
            <Summary {...this.deps} {...this.props} />
        );
    }
}

export default SummaryProvider;