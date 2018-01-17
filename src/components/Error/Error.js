import React, { Component, PropTypes } from 'react';

import Page from 'components/Page';

class Error extends Component {
    static propTypes = {
        error: PropTypes.object.isRequired
    }

    render() {
        const { error } = this.props;
        const notification = {
            annotation: error.annotation,
            message: error.message,
            type: 'alert'
        };

        return(
            <Page notification={notification} type="modal" />
        )
    }
}

export default Error;