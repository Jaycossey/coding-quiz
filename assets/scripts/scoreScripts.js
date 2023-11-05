// GLOBALS ----------------------------------------------------
let listEl = document.getElementById('listEl');

const highScore = JSON.parse(localStorage.getItem("scores"));

// LIST FUNCTIONS ---------------------------------------------

function sortList() {
    // console.log("sortList function");
    console.log("original array:\n", highScore);

    /**
     * So now that I have a persistent array of objects in local storage that updates 
     * every time a user has completed the quiz, I need to use those objects to create 
     * a list of users for the highscores. 
     * 
     * I need to create an array to handle the scores and then sort that array by score in descending
     * order
     * 
     * 
     */
    


    createLiElements();
};

function appendList() {
    console.log("Append function");
}

listEl.onload = sortList();