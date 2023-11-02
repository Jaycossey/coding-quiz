// GLOBALS -------------------------------------------------------------------
// element references
const startButton = document.getElementById('startButton');
const timerEl = document.getElementById('time');
const questionContainer = document.getElementById('questionEl')

// penalty for wrong answer
const penalty = 5;
// score
let score = 0;

// timer max
let timeRemaining = 75;

// question count
let questionCount = 0;

// empty array to store question objects
let questionSet = [];


// API CALL AND STORAGE ------------------------------------------------------

// async fetch 30 quetions from API 
async function fetchQuestions() {
    // API url
    const apiURL = "https://opentdb.com/api.php?amount=30&category=18";
    // await response from url
    const response = await fetch(apiURL);
    // store objects in array
    const questions = await response.json();
    // once results have been stored, add event listener to button
    startButton.addEventListener('click', startTimer);
    console.log(questions.results);

    return questions.results;
}

// store results objects from fetch in array
// Bugfix, couldn't target data until correctly parsed
fetchQuestions().then((data) => {
    questionSet = data;
});


// TIMER FUNCTIONS -----------------------------------------------------------

// set timer on start button click (called in html)
function startTimer() {
    // set timer to default 
    timerEl.innerText = timeRemaining;
    // remove event listener to prevent double clicks and function calls
    startButton.removeEventListener('click', startTimer);

    // start question display
    questionTime(0);
    // loop for 75 seconds with timeout 
    for (let i = 0; i <= timeRemaining; i++) {
        setTimeout(() => {
            // set inner text as countdown
            timerEl.innerText = timeRemaining - i;
        }, 100 * i);
    }
}

// QUESTION DOM MANIPULATION ------------------------------------------------

/**
 * These functions take "count" as arguments, where "count" is the question
 * count, after a question has been answered, "count" is increased by 1
 * iterating through the question array. 
 */


// function to handle bool values
function boolQuestion(count) {
    // All elements created with className to enable reusable styling.
    console.log("This is a bool question function");
    // create new Div to contain the bool questions
    let newDiv = document.createElement('div');
    newDiv.className = "booleanQuestionContainer";
    
    // create new P element to contain the question text
    let newPEl = document.createElement('p');
    newPEl.className = "boolQuestionText";
    newPEl.textContent = questionSet[count].question;

    // create true and false buttons
    let trueButton = document.createElement('button');
    trueButton.className = "boolTrue";
    trueButton.innerText = "true";

    let falseButton = document.createElement('button');
    falseButton.className = "boolFalse";
    falseButton.innerText = "false";

    console.log(newDiv);
    console.log(newPEl);
    console.log(trueButton);
    console.log(falseButton);

    /**
     * append div to body, appendChild to newDiv
     * All "button" elements need click event listener
     * value of those buttons should be bool values
     * onclick = if value === questionSet[count].correct_answer
     * score++;
     * count++;
     * 
     * else 
     * timer--;
     * count++;
     * questionTime(questionCount)
     * 
     * 
     */
}

// function to handle multiple choice
function multiQuestion(count) {
    console.log("this is multi function");
}

// function to begin quiz, handles question type and calls respective funcitons
// takes "question number" as arg to handle array loops
function questionTime(count) {
    // now I can access the data (Thankyou Gurjeet!), I can manipulate that and create 
    // a set of functions to handle the questions and answers.
    console.log(questionSet[count].question);

    // calculate score depending on whether user has beaten timer
    if (questionCount >= 30) {
        return;
    }

    // if/else to handle question types.
    // bool / multichoice
    if (questionSet[count].type === 'boolean') {
        boolQuestion(count);
    } else {
        multiQuestion(count);
    }

}