import React, { Component } from 'react';
import './Timer.css';

class Timer extends Component {
    render() {
        return (
            <React.Fragment>
                <div className='timer-number'>
                    Timer: {this.props.time}
                </div>
            </React.Fragment>
        )
    }
}

export default Timer