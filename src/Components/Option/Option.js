import React from 'react';
import './Option.css';

class Option extends React.Component {
    render() {
        const { answerNumber, answerText, color, nextQuestion } = this.props
        return (
            <React.Fragment>
                <div onClick={() => {nextQuestion(answerText)}} className='answer-container' style={{background: color}}>
                    {answerNumber}) {answerText}
                </div>
            </React.Fragment>
        )
    }
}

export default Option