// Duration of the countdown in milliseconds (2 minutes)
const countdownDuration = 1 * 60 * 1000;

// Function to format time as MM:SS
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Function to update the timer display
function updateTimer() {
    const now = Date.now();
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) {
        // Timer has finished
        document.getElementById('timer').textContent = '00:00';
        clearInterval(timerInterval);
        
        // Alert user and reset timer
        alert('Time is up!');
        resetTimer();
    } else {
        // Update the display
        document.getElementById('timer').textContent = formatTime(timeRemaining);
    }
}

// Function to reset the timer
function resetTimer() {
    endTime = Date.now() + countdownDuration;
    localStorage.setItem('endTime', endTime);
    timerInterval = setInterval(updateTimer, 1000);
}

// Get the end time from localStorage or set it if not available
let endTime = localStorage.getItem('endTime');
if (!endTime) {
    endTime = Date.now() + countdownDuration;
    localStorage.setItem('endTime', endTime);
}

// Update the timer every second
let timerInterval = setInterval(updateTimer, 1000);

// Initial call to display the timer immediately
updateTimer();
