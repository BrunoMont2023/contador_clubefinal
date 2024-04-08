let countdownInterval;
let endTime;
let paused = false;
let groupTimers = {};

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

    // Limpar timers dos grupos anteriores
    for (const group in groupTimers) {
        clearInterval(groupTimers[group]);
    }
    groupTimers = {};

    // Criar timers individuais para cada grupo
    const groupNames = document.getElementById('group-names').value.trim().split('\n');
    const numGroups = Math.min(groupNames.length, 8); // Limitar a 8 grupos
    for (let i = 0; i < numGroups; i++) {
        const groupName = groupNames[i].trim();
        if (groupName) {
            createGroupTimer(groupName);
        }
    }
}

function createGroupTimer(groupName) {
    const groupTimer = setInterval(() => {
        const now = Date.now();
        const remainingTime = endTime - now;

        if (remainingTime <= 0) {
            clearInterval(groupTimer);
            alert(`Tempo esgotado para o grupo "${groupName}"!`);
            return;
        }

        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
        document.getElementById(`timer-${groupName}`).textContent = formattedTime;
    }, 1000);

    groupTimers[groupName] = groupTimer;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function pauseCountdown() {
    clearInterval(countdownInterval);
    for (const group in groupTimers) {
        clearInterval(groupTimers[group]);
    }
    paused = true;
}

function resumeCountdown() {
    if (paused) {
        countdownInterval = setInterval(updateCountdown, 1000);
        for (const group in groupTimers) {
            createGroupTimer(group);
        }
        paused = false;
    }
}

function resetCountdown() {
    clearInterval(countdownInterval);
    for (const group in groupTimers) {
        clearInterval(groupTimers[group]);
        document.getElementById(`timer-${group}`).textContent = '00:00:00';
    }
    document.getElementById('activity-title').textContent = 'Contador Regressivo';
    document.getElementById('countdown-display').style.display = 'none';
}
