// GLOBALS -------------------------------------------------------------------
// element references
const startButton = document.getElementById('startButton');
const timerEl = document.getElementById('time');
const questionContainer = document.getElementById('questionEl');
const currentScoreContainer = document.getElementById('score');

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
    questionTime(questionCount);
    // loop for 75 seconds with timeout 
    for (let i = 0; i <= timeRemaining; i++) {
        setTimeout(() => {
            // set inner text as countdown
            timerEl.innerText = timeRemaining - i;
            // MUST remember to change this timeout to 1000 * i before deployment-------------------------!!
        }, 100 * i);
    }
}

// QUESTION DOM MANIPULATION ------------------------------------------------

// function to remove current question once answer is clicked
function removeCurrent(element) {
    // console.log("Remove Element");
    questionContainer.removeChild(element);
    questionTime(questionCount);
    return;
}

// check answers
function checkAnswer(value, count, element) {
    if (value == questionSet[count].correct_answer) {
        score++;
        currentScoreContainer.textContent = score;
        questionCount++;
        removeCurrent(element);
    } else {
        score--;
        currentScoreContainer.textContent = score;
        questionCount++;
        removeCurrent(element);
    }
}


// function to handle bool values
function boolQuestion(count) {
    // All elements created with className to enable reusable styling.
    // create new Div to contain the bool questions
    let newDiv = document.createElement('div');
    newDiv.className = "booleanQuestionContainer";
    
    // create new P element to contain the question text
    let newPEl = document.createElement('p');
    newPEl.className = "boolQuestionText";
    newPEl.textContent = questionSet[count].question;

    // create true buttons
    let trueButton = document.createElement('button');
    trueButton.className = "boolTrue";
    trueButton.innerText = "true";

    // create false button
    let falseButton = document.createElement('button');
    falseButton.className = "boolFalse";
    falseButton.innerText = "false";

    // append children to parent div
    newDiv.appendChild(newPEl);
    newDiv.appendChild(trueButton);
    newDiv.appendChild(falseButton);

    return newDiv;

}

// function to handle random arrangement of answers
function assignSortedAnswers(count) {
    // assign answers to array !IMPORTANT - if multi choice has > 4 answers, this code WILL break. 
    let randomAnswerArray = [];

    randomAnswerArray.push(questionSet[count].correct_answer);

    // not all multi choice had same incorrect answer amount, this will dynamically produce those answers
    // rather than assigning undefined.
    for (let i = 0; i < questionSet[count].incorrect_answers.length; i++) {
        randomAnswerArray.push(questionSet[count].incorrect_answers[i]);
    }
    // return sorted answers array
    return randomAnswerArray.sort();
}


// function to handle multiple choice
function multiQuestion(count) {
    // create div container for question
    let newDiv = document.createElement('div');
    newDiv.className = "multiQuestionContainer";

    // create question p element and append
    let newPEl = document.createElement('p');
    newPEl.className = "multiQuestionText";
    newPEl.innerText = questionSet[count].question;
    newDiv.appendChild(newPEl);

    // sorted answers by alpha
    let answerArray = assignSortedAnswers(count);

    // array to store buttons for each answer
    let buttonArray = [];
    // loop through answers 
    for (let i = 0; i < answerArray.length; i++) {
        // create button for each answer and assign
        let newButton = document.createElement('button');
        newButton.className = "multi-answer";
        newButton.innerText = answerArray[i];
        // store in button array
        buttonArray.push(newButton);
        // append to parent div
        newDiv.appendChild(newButton);
    }

    return newDiv;
}

// manage and add click events to elements
function manageClickEvents(element) {
    console.log(element);

    element.addEventListener('click', function(event) {
        console.log(event);
        checkAnswer(event.target.innerText, questionCount, element);
    });
}

// function to begin quiz, handles question type and calls respective funcitons
function questionTime(count) {
    // calculate score depending on whether user has beaten timer
    if (questionCount >= 30) {
        return;
    }

    // if/else to handle question types.
    if (questionSet[count].type === 'boolean') {
        // Create bool question and append
        const boolQuEl = boolQuestion(count);
        questionContainer.appendChild(boolQuEl);
        manageClickEvents(boolQuEl);
    } else {
        // create multiple choice
        const multiQuEl = multiQuestion(count);
        questionContainer.appendChild(multiQuEl);
        manageClickEvents(multiQuEl);
    }
}

/**
 * CURRENT BUGS!!
 * 
 * When the quiz loads, the first question renders and deletes correctly,
 * as the second question renders, then the answers are scrambled. Showing 
 * answers from previous iterations
 * 
 * potential and likelyhood of problem source:
 * 
 * - On questionTime(count) call - when removeCurrent is calling this, is it actually removing the 
 *          element from the stack? 
 * - When assignRandomAnswers is called - is this function removing the elements from screen or DOM?
 * 
 * - Within questionTime - I need to track and console.log all potential errors for this bug. at all points.
 *          - utilise breakpoints where I can to help ease the debugging
 * 
 * - ChatGPT? - HA! next joke
 * 
 * - the api is called once per window load, generating 20 questions and answers for those on CS topics
 * - the api data is stored and called/referenced correctly 
 * 
 * - The issue is the button elements, I need to look at the values within.
 * 
 * - so first question was bool type on this specific test: 
 * 
 *      correct button generation on first iteration
 *      incorrect on second, console.log isnt showing children on either of these 2
 * 
 *      3rd iteration was correct generation
 *      4th iteration shows button children exist but only 3/4 
 *              this iteration's button text content is also incorrect for the input. ergo - potential issue is that the generate answer functions
 *              for multi choice is incorrect. why? THE LOOP!!!!! the loop uses i but at the same time I am using i for the count (knew I was wrong with that)
 */