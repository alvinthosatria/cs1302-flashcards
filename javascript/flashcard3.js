const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')

var xp = 0
let shuffledQuestions, currentQuestionIndex
startButton.addEventListener('click', startPractise)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})

const questions = [
    {
        question: 'What will this python code output? \nprint(("2+3" == 5) == 0)',
        answers: [
            {text: 'True', correct: true},
            {text: 'False', correct: false},
            {text: '0', correct: false},
            {text: '5', correct: false}
        ]
    },
    {
        question: 'What is the maximum value of index? \nfor index in range(3,5)',
        answers: [
            {text: '3', correct: false},
            {text: '5', correct: false},
            {text: '4', correct: true},
            {text: '5.5', correct: false}
        ]
    },

    {
        question: 'Select the output of: \nprint(1 == 0 == False == True)',
        answers: [
            {text: '1', correct: false},
            {text: '0', correct: false},
            {text: 'True', correct: false},
            {text: 'False', correct: true}
        ]
    }
]

function startPractise() {
    startButton.classList.add('hide')
    questionContainerElement.classList.remove('hide')
    shuffledQuestions = questions.sort(() => Math.random() - 0.5)
    currentQuestionIndex = 0
    setNextQuestion()
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
    questionElement.innerText = question.question
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', selectAnswer)
        answerButtonsElement.appendChild(button)
    })
}

function resetState() {
    nextButton.classList.add('hide')
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}


function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })//returning a live collection and update on its own, convert it into an array

    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    } else {
        startButton.innerText = "Go Again!"
        startButton.classList.remove('hide')
    }

    

}

function setStatusClass(element, correct) {
    clearStatusClass(element)
    //Add the 'correct' and 'wrong' class to the corresponding element
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
    //remove the 'correct' and 'wrong' classes from the elements
}


//gauge script

const gaugeElement = document.querySelector(".gauge");

function setGaugeValue(gauge, value) {
    if (value < 0 || value > 1) {
        return;
    }
    //to fill the gauge, the turn range is from 0 to 0.5
    gauge.querySelector('.gauge-fill').style.transform=`rotate(${value / 2}turn)`; 
    gauge.querySelector('.gauge-cover').textContent = `${Math.round(value * 100)}/100XP`;
}

setGaugeValue(gaugeElement, xp)