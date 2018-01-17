import React, { Component } from 'react';

import Image from './Image';
import ImageViewModel from './ImageViewModel.js';

class ImageProvider extends Component {
    constructor(props, content) {
        super(props, content);

        this.deps = {
            viewModel: ImageViewModel.create()
        };
    }

    render() {
        return (
            <Image {...this.deps} {...this.props} />
        );
    }
}

export default ImageProvider;