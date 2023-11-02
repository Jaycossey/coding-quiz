// GLOBALS -----------------------------------------------------------
const timerEl = document.getElementById('time');
let timeRemaining = 75;

function startTimer() {
    for (let i = 0; i <= timeRemaining; i++) {
        setTimeout(() => {
            timerEl.innerText = timeRemaining - i;
        }, 1000 * i);
    }
}
