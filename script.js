let countdownInterval;
let endTime;
let paused = false;

function updateTitle() {
    const activityName = document.getElementById('activity-name').value.trim();
    document.getElementById('activity-title').textContent = activityName || 'Contador Regressivo';
}

function startCountdown() {
    const activityName = document.getElementById('activity-name').value.trim();
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;

    if (hours <= 0 && minutes <= 0) {
        alert('Por favor, insira uma duração válida.');
        return;
    }

    const now = Date.now();
    endTime = now + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);

    document.getElementById('activity-title').textContent = activityName || 'Contador Regressivo';
    document.getElementById('countdown-display').style.display = 'block';
    updateCountdown(); // Atualiza imediatamente ao iniciar

    countdownInterval = setInterval(updateCountdown, 1000);
    paused = false;
}

function updateCountdown() {
    const now = Date.now();
    const remainingTime = endTime - now;

    if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        document.getElementById('timer').textContent = '00:00:00';
        alert('Tempo esgotado para a atividade!');
        return;
    }

    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    document.getElementById('timer').textContent = formattedTime;
}

function pauseCountdown() {
    clearInterval(countdownInterval);
    paused = true;
}

function resumeCountdown() {
    if (paused) {
        countdownInterval = setInterval(updateCountdown, 1000);
        paused = false;
    }
}

function resetCountdown() {
    clearInterval(countdownInterval);
    document.getElementById('activity-title').textContent = 'Contador Regress
