import React from 'react';
import './Score.css';

class Score extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className='score-container'>
                    Score: {this.props.currentScore || 0}
                </div>
            </React.Fragment>
        )
    }
}

export default Score