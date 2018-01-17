import React, { Component, PropTypes, Children } from 'react';
import { observable } from 'mobx';

import Star from './Star';

import classNames from 'utils/classNames';
import styles from './Rating.scss';

class Rating extends Component {
    @observable newRating = 0;

    static propsType = {
        className: PropTypes.string,
        total: PropTypes.number,
        rating: PropTypes.number,
        interactive: PropTypes.bool,
        onRate: PropTypes.func
    };

    static defaultProps = {
        total: 5,
        rating: 0,
        interactive: true
    };

    constructor(props) {
        super(props);
        this.state = {
            rating: props.rating,
            lastRating: props.rating,
            isRating: false
        }
    }

    componentWillReceiveProps(nextProps,prevProps) {
        const { rating } = nextProps;
        if (rating !== prevProps.rating) {
            this.setState({
                rating,
                lastRating:rating
            })
        }
    }

    onCancelRate(event) {
        const { lastRating: rating} = this.state;
        this.setState({
            rating,
            isRating: false
        });
        this.callback({...event,rating});
    }

    callback(args) {
        const { onRate: callback } = this.props;
        callback && callback(args);
    }

    onRate(rating, event) {
        this.setState({
            rating,
            lastRating: rating
        });
        this.newRating = rating;
        this.callback({...event, rating});
    }

    willRate(rating, event) {
        this.setState({
            rating,
            isRating: true
        });
        this.callback({...event,rating});
    }

    render() {
        let { className, total, interactive, children, ...restProps } = this.props;
        const { rating, isRating } = this.state;
        children = Children.toArray(children);
        const cls = classNames([
            styles.reactRater
        ]);
        let result = (<span className={styles.result}>{this.newRating} of 5</span>);

        const nodes = Array.apply(null, Array(total)).map((_,i) => {

            let starProps = {
                isActive: !isRating && rating-i >= 1,
                willBeActive: isRating && i < rating,
                isActiveHalf: !isRating && (rating - i >= 0.5 && rating - i < 1),
                isDisabled: !interactive
            };

            return (
                <div
                    key={`star-${i}`}
                    onClick={interactive ? this.onRate.bind(this,i+1) : null}
                    onMouseEnter={interactive ? this.willRate.bind(this,i+1) : null}
                >
                    { children.length ? React.cloneElement(children[i % children.length],starProps) : <Star {...starProps}/>}
                </div>
            );
        });
        if(interactive) {
            return (
                <div
                    className={cls}
                    onMouseLeave={this.onCancelRate.bind(this)}

                >
                    { nodes }
                    { result }
                </div>
            );
        }
        else {
            return (
                <div className={cls}>
                    { nodes }
                </div>
            );
        }
    }
}

export default Rating;