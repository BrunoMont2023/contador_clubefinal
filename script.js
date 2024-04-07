const timers = {};

function startTimer(groupId) {
    const activityNameInput = document.querySelector(`#${groupId} .activity-name`);
    const timerDisplay = document.querySelector(`#${groupId} .timer`);
    const activityName = activityNameInput.value.trim();
    
    if (activityName === '') {
        alert('Por favor, insira o nome da atividade.');
        return;
    }
    
    const duration = parseInt(prompt('Digite a duração da atividade (em minutos):', '15'));
    
    if (isNaN(duration) || duration <= 0) {
        alert('Por favor, insira uma duração válida para a atividade.');
        return;
    }
    
    const endTime = Date.now() + duration * 60 * 1000;
    timers[groupId] = setInterval(() => updateTimer(timerDisplay, endTime), 1000);
}

function pauseTimer(groupId) {
    clearInterval(timers[groupId]);
    delete timers[groupId];
}

function resetTimer(groupId) {
    const timerDisplay = document.querySelector(`#${groupId} .timer`);
    timerDisplay.textContent = '00:00:00';
    clearInterval(timers[groupId]);
    delete timers[groupId];
}

function updateTimer(timerDisplay, endTime) {
    const remainingTime = endTime - Date.now();

    if (remainingTime <= 0) {
        timerDisplay.textContent = '00:00:00';
        clearInterval(timers[groupId]);
        delete timers[groupId];
        alert('Atividade concluída!');
    } else {
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        const formattedTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        timerDisplay.textContent = formattedTime;
    }
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}


