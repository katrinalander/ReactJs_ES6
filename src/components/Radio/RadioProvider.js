import React, { Component } from 'react';
import Radio from './Radio';
import RadioViewModel from './RadioViewModel';

class RadioProvider extends Component {
    constructor(props, content){
        super(props, content);

        this.deps = {
            viewModel: RadioViewModel.create()
        };
    }

    render() {
        return(
            <Radio {...this.deps} {...this.props}/>
        );
    }
}

export default RadioProvider;