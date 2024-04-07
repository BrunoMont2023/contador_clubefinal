let countdownInterval;
let countdownPaused = false;
let countdownEndTime;
let remainingTime;

function startCountdown() {
    const activityName = document.getElementById('activityName').value;
    const totalMinutes = parseInt(prompt('Por quantos minutos deseja contar?', '30'));

    if (!isNaN(totalMinutes) && totalMinutes > 0) {
        countdownEndTime = Date.now() + totalMinutes * 60 * 1000;

        if (!countdownInterval) {
            countdownInterval = setInterval(updateCountdown, 1000);
        }

        countdownPaused = false;
    } else {
        alert('Por favor, insira um valor válido para os minutos.');
    }
}

function pauseCountdown() {
    countdownPaused = true;
}

function resetCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    countdownEndTime = null;
    countdownPaused = false;
    document.getElementById('countdown').textContent = '00:00:00';
}

function updateCountdown() {
    if (!countdownEndTime) return;

    const now = Date.now();
    remainingTime = countdownEndTime - now;

    if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        document.getElementById('countdown').textContent = '00:00:00';
        alert('Contagem regressiva concluída para: ' + document.getElementById('activityName').value);
    } else {
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        const formattedTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        document.getElementById('countdown').textContent = formattedTime;
    }
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

