import React from 'react';
import './App.css';
import Timer from './Components/Timer/Timer';
import QuestionBox from './Components/QuestionBox/QuestionBox';
import Score from './Components/Score/Score';
import Option from './Components/Option/Option'

class App extends React.Component {
    
    constructor() {
        super()
        this.state = {
            timer: 10,
            sessionToken: "",
            questions: [],
            questionIndex: 0,
            optionsArray: [],
            score: 0,
            showStartModal: true,
            isLoading: false,
            timerId: null,
            showEndModal: false,
            results: {
                10: 'Genius',
                9: 'Almost Genius',
                8: 'Smart',
                7: 'Average',
                6: 'Average',
                5: 'Average',
                4: 'Dumb',
                3: 'Dumb',
                2: 'Somehow worse than randomly guessing',
                1: 'Hello?',
                0: '...'
            }
        }

        this.startGame = this.startGame.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
    }

    componentDidMount() {
        this.getSessionToken()
    }

    componentDidUpdate() {
        if (this.state.timer === -1) {
            this.nextQuestion()
        }
    }

    async getSessionToken() {
        try {
            const res = await fetch('https://opentdb.com/api_token.php?command=request')
            const data = await res.json()
            this.setState({sessionToken: data.token})
        }
        catch(e) {
            throw new Error(e)
        }
    }

    async startGame() {
        try {
            this.setState({score: 0})
            this.setState({timer: 10})
            this.setState({showEndModal: false})
            this.setState({showStartModal: false})
            this.setState({isLoading: true})
            const res = await fetch(`https://opentdb.com/api.php?amount=10&type=multiple&difficulty=easy&category=22&token=${this.state.sessionToken}`)
            const data = await res.json()
            this.setState({questions: data.results}, () => {
                this.setState({optionsArray: this.getOptionsArray()})
                this.setState({isLoading: false})
                this.setTimer()
            }
            )
        }
        catch(e) {
            throw new Error(e)
        }
    }

    getOptionsArray() {
        const { questions, questionIndex } = this.state
        const optionsArray = [questions[questionIndex].correct_answer, ...questions[questionIndex].incorrect_answers]
        // randomly shuffle array
        for (let i = optionsArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
            [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
        }
        return optionsArray
    }
    
    nextQuestion(chosenAnswer) {
        const { questions, questionIndex } = this.state

        if (questionIndex === questions.length - 1) {
            clearInterval(this.intervalId)
            if (questions[questionIndex].correct_answer === chosenAnswer) {
                this.setState((prevState) => {
                    return {score: prevState.score + 1}
                })
            }
            this.setState({questionIndex: 0})
            this.setState({showEndModal: true})
        }

        else {
            console.log(chosenAnswer)
            console.log(questions[questionIndex].correct_answer)
            this.setState({timer: 10})
            if (questions[questionIndex].correct_answer === chosenAnswer) {
                this.setState((prevState) => {
                    return {score: prevState.score + 1}
                })
            }
            this.setState((prevState) => {
                return {questionIndex: prevState.questionIndex + 1}
            }, () => {
                this.setState({optionsArray: this.getOptionsArray()})
            }, () => {
                this.setTimer()
            })
        }
    }

    setTimer() {
        this.intervalId = setInterval( () => {
            if (this.state.timer === -1) {
                clearInterval(this.intervalId)
            }
            this.setState((prevState) => {
                return {timer: prevState.timer - 1}
            }, () => {console.log(this.state.timer)})
    }, 1000)
    }

    render() {
        const {timer, questions, questionIndex, optionsArray, score, showStartModal, isLoading, showEndModal} = this.state
        return (
            <React.Fragment>
                <div className="main-container">
                    <div className="upper-third">
                        <Timer time={timer}/>
                        <QuestionBox questionTxt={(questions[questionIndex] && questions[questionIndex].question) || ""} questionIndex={questionIndex}/>
                        <Score currentScore={score}/>
                    </div>
                    <div className='answers-container'>
                        <Option answerNumber={1} answerText={optionsArray[0]} color="#289D8F" nextQuestion={this.nextQuestion}/>
                        <Option answerNumber={2} answerText={optionsArray[1]} color="#E9646A" nextQuestion={this.nextQuestion}/>
                        <Option answerNumber={3} answerText={optionsArray[2]} color="#F4A261" nextQuestion={this.nextQuestion}/>
                        <Option answerNumber={4} answerText={optionsArray[3]} color="#627ac2" nextQuestion={this.nextQuestion}/>
                    </div>
                </div>

                {showStartModal && <div style={{position: 'absolute', top: 0, height: '100vh', width: '100%', background: 'rgba(0,0,0,0.5)'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', height: '70%', width: '25%', background: 'lightblue', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '10px'}}>
                    <h3>Rules:</h3>
                    <ul>
                        <li>10 Questions in total</li>
                        <li>10 Seconds per question</li>
                        <li>What the scores mean:
                            <ul>
                                <li>10/10: Genius</li>
                                <li>9/10: Almost Genius</li>
                                <li>8/10: Smart</li>
                                <li>5-7/10: Average</li>
                                <li>3-4/10: Dumb</li>
                                <li>2/10: Somehow worse than randomly guessing</li>
                                <li>1/10: Hello?</li>
                                <li>0/10: ...</li>
                            </ul>
                        </li>
                    </ul>
                    <button onClick={this.startGame}>Start Game</button>
                </div>
                </div>}

                {showEndModal && <div style={{position: 'absolute', top: 0, height: '100vh', width: '100%', background: 'rgba(0,0,0,0.5)'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', height: '200px', width: '200px', background: 'lightblue', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '10px'}}>
                    <h4>Your Score:</h4>
                    <p>{this.state.score}/10: {this.state.results[this.state.score]}</p>
                    <button onClick={this.startGame}>Start Over</button>
                </div>
                </div>}

                {isLoading && <div style={{position: 'absolute', top: 0, height: '100vh', width: '100%', background: 'rgba(0,0,0,0.4)'}}><div className="loader"></div> </div>}
            </React.Fragment>
        )
    }
}

export default App;
