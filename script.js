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
    for (let i = 0; i < numGroups; i++)
