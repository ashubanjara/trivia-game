import React, {Component} from 'react';
import './QuestionBox.css';

class QuestionBox extends Component {

    decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
    
    render() {
        const { questionTxt, questionIndex } = this.props;
        return (
        <div className='question-card'>
            <div className='question-number'>
                {questionIndex + 1}/10
            </div>
            <div className='question-text'>
                {this.decodeHtml(questionTxt)}
            </div>
        </div>
        )
    }
}

export default QuestionBox