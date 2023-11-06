// GLOBALS ----------------------------------------------------
// create variable for element to append to
let listEl = document.getElementById('listEl');
// create array of objects from local storage
const highScore = JSON.parse(localStorage.getItem("scores"));


// LIST FUNCTIONS ---------------------------------------------
// create element function
function createLiElements(object) {
    // create new list element
    let newLiEl = document.createElement('li');
    // assign text content to element
    newLiEl.textContent = object.userName + ": " + object.score;
    // append function call
    appendList(newLiEl);
}

// function to append element to listEl
function appendList(element) {
    listEl.appendChild(element);
}

// sort the scores by high to low
highScore.sort((a, b) => (a.score < b.score) ? 1: -1);

// for each score, create Element
highScore.forEach(element => {
    createLiElements(element);
});