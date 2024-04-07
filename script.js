let timer; // Variável para armazenar o timer
let endTime; // Variável para armazenar o tempo de término
let paused = false; // Variável para rastrear se o contador está pausado
const timerDisplay = document.getElementById('timer');

function startCountdown() {
    const activityName = document.getElementById('activity-name').value.trim();
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;

    if (!activityName) {
        alert('Por favor, insira o nome da atividade.');
        return;
    }

    if (hours <= 0 && minutes <= 0) {
        alert('Por favor, insira uma duração válida.');
        return;
    }

    const now = Date.now();
    endTime = now + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);

    // Iniciar o contador regressivo
    timer = setInterval(updateCountdown, 1000);
    paused = false;
}

function updateCountdown() {
    const now = Date.now();
    const remainingTime = endTime - now;

    if (remainingTime <= 0) {
        clearInterval(timer);
        timerDisplay.textContent = '00:00:00';
        alert('Tempo esgotado!');
        return;
    }

    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    timerDisplay.textContent = formattedTime;
}

function pauseCountdown() {
    clearInterval(timer);
    paused = true;
}

function resetCountdown() {
    clearInterval(timer);
    timerDisplay.textContent = '00:00:00';
    paused = false;
}

function padZero(num) {
    return (num < 10 ? '0' : '') + num;
}
