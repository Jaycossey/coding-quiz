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
    // console.log(questions.results);

    return questions.results;
}

// store results objects from fetch in array
// Bugfix, couldn't target data until correctly parsed
fetchQuestions().then((data) => {
    questionSet = data;
});


// HIGHSCORE FUNCTIONS -------------------------------------------------------
let scoreList = [];

// function to update scores List with existing data
function updateScores() {
    // set temp current scorelist
    let currentScore = JSON.parse(localStorage.getItem("scores"));
    // return if local storage doesnt exist
    if (currentScore === null) return;

    // push each existing to scoreList array
    currentScore.forEach((item) => {
        scoreList.push(item);
    });
    return;
}


// constructor for scorelist objects
class HighScoreItem {
    // object to be stored takes username and score
    constructor(userName, userScore) {
        this.userName = userName;
        this.score = userScore;
    }
}

// assign scores to local storage
function assignScores(userName) {
    updateScores();
    // create new score list item with current user and score
    const newScore = new HighScoreItem(userName, score);
    scoreList.push(newScore);
    // store object in local storage with username as key
    localStorage.setItem("scores", JSON.stringify(scoreList));
    return;
}

// end of quiz handler
function scorePrompt() {
    // create input and instruction for user to save high score
    const promptDiv = document.createElement('div');
    const userNameInst = document.createElement('p');
    const userNamePrompt = document.createElement('input');

    // detail prompt text and intial value
    userNameInst.innerText = "Input your initials";
    userNamePrompt.placeholder = "eg: ABC";
    userNamePrompt.value = "";
    userNamePrompt.className = "inputInit";
    userNamePrompt.id = "inputInitials";

    // append elements to parent div
    promptDiv.appendChild(userNameInst);
    promptDiv.appendChild(userNamePrompt);

    // onsubmit event listener to assign score
    userNamePrompt.addEventListener("keypress", function(event) {
        if (event.key == 'Enter') {
            assignScores(userNamePrompt.value);
            questionContainer.removeChild(promptDiv);
            startButton.style.visibility = "visible";
        }
    });

    // append the prompts to the container to display on screen
    questionContainer.append(promptDiv);
}


// TIMER FUNCTIONS -----------------------------------------------------------

// set timer on start button click (called in html)
function startTimer() {
    // set timer to default 
    timerEl.innerText = timeRemaining;
    // remove event listener to prevent double clicks and function calls
    startButton.style.visibility = "hidden";

    // start question display
    questionTime(questionCount);
    // loop for 75 seconds with timeout 
    for (let i = 0; i <= timeRemaining; i++) {
        setTimeout(() => {
            // set inner text as countdown
            timerEl.innerText = timeRemaining - i;
        }, 1000 * i);
    }
    
}


// QUESTION DOM MANIPULATION ------------------------------------------------

// function to remove current question once answer is clicked
function removeCurrent(element) {
    // console.log("Remove Element");
    questionContainer.removeChild(element);
    
    // ensure that the timer hasn't reached 0 before generating next question
    if (timerEl.innerText <= 0) {
        scorePrompt();
        return;
    } else {
        // generate next question
        questionTime(questionCount);
        return;
    }
}

// check answers
function checkAnswer(value, count, element) {
    // if correct answer
    if (value == questionSet[count].correct_answer) {
        // add 1 to score, set score to screen
        score++;
        currentScoreContainer.textContent = score;
        // iterate to next question and remove current question
        questionCount++;
        removeCurrent(element);
    } else {
        // add conditional to prevent below 0 score
        if (score <= 0) {
            currentScoreContainer.textContent = score;
            questionCount++;
            removeCurrent(element);
        } else {
            // score -- on incorrect answer and above 1 point
            score--;
            // as above, update score display and iterate question
            currentScoreContainer.textContent = score;
            questionCount++;
            removeCurrent(element);
        }
        
    }
}


// function to handle bool values
function boolQuestion(count) {
    // All elements created with className to enable reusable styling.
    // create new Div to contain the bool questions
    let newDiv = document.createElement('div');
    newDiv.className = "questionContainer";
    
    // create new P element to contain the question text
    let newPEl = document.createElement('p');
    newPEl.className = "questionText";
    newPEl.innerHTML = questionSet[count].question;

    // create true buttons
    let trueButton = document.createElement('button');
    trueButton.className = "answerButton";
    trueButton.innerHTML = "true";

    // create false button
    let falseButton = document.createElement('button');
    falseButton.className = "answerButton";
    falseButton.innerHTML = "false";

    // append children to parent div
    newDiv.appendChild(newPEl);
    newDiv.appendChild(trueButton);
    newDiv.appendChild(falseButton);

    return newDiv;

}

// function to handle random arrangement of answers
function assignSortedAnswers(count) {
    // assign correct answers to declared array
    let randomAnswerArray = [];
    randomAnswerArray.push(questionSet[count].correct_answer);

    // not all multi choice had same incorrect answer amount, this will dynamically produce those answers
    // rather than assigning undefined. -- Realistically I could have also dynamically created
    // elements in the same way, oversight on my part can fix at later date if needed - not urgent
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
    newDiv.className = "questionContainer";

    // create question p element and append
    let newPEl = document.createElement('p');
    newPEl.className = "questionText";
    newPEl.innerHTML = questionSet[count].question;
    newDiv.appendChild(newPEl);

    // sorted answers by alpha
    let answerArray = assignSortedAnswers(count);

    // array to store buttons for each answer
    let buttonArray = [];
    // loop through answers 
    for (let i = 0; i < answerArray.length; i++) {
        // create button for each answer and assign
        let newButton = document.createElement('button');
        newButton.className = "answerButton";
        newButton.innerHTML = answerArray[i];
        // store in button array
        buttonArray.push(newButton);
        // append to parent div
        newDiv.appendChild(newButton);
    }

    return newDiv;
}

// manage and add click events to elements
function manageClickEvents(element) {
    // add event listener to each button element
    element.addEventListener('click', function(event) {
        if (questionCount >= 30) {
            score += timeRemaining;
            scorePrompt();
        }
        // check answers against target clicked
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
 * Current bugs/issues discovered:
 * 
 * - If the user completes 30 questions before the end of the timer, then the user would have to wait for timer to finish
 *          before being able to input their initials for the high score
 * 
 * - If the user inputs an incorrect answer, then the timer penalty is not applied, this was a requested feature so will need
 *          fixing asap
 * 
 */