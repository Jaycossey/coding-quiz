// GLOBALS ----------------------------------------------------
let listEl = document.getElementById('listEl');

const highScore = JSON.parse(localStorage.getItem("scores"));

// LIST FUNCTIONS ---------------------------------------------
function createLiElements() {
    console.log("createEl");
    appendList();
}

function appendList() {
    console.log("Append function");
}

function sortList() {
    // console.log("sortList function");
    console.log("original array:\n", highScore);

    


    createLiElements();
};

listEl.onload = sortList();