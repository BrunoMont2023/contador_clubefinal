const timers = {}; // Objeto para armazenar os timers

function startTimer(group, activityIndex) {
    const timerId = `${group}-${activityIndex}`;
    const duration = parseInt(prompt('Digite a duração da atividade (em minutos):', '15'));

    if (!isNaN(duration) && duration > 0) {
        const endTime = Date.now() + duration * 60 * 1000;
        timers[timerId] = setInterval(() => updateTimer(timerId, endTime), 1000);
    } else {
        alert('Por favor, insira uma duração válida para a atividade.');
    }
}

function pauseTimer(group, activityIndex) {
    const timerId = `${group}-${activityIndex}`;
    clearInterval(timers[timerId]);
    delete timers[timerId];
}

function resetTimer(group, activityIndex) {
    const timerId = `${group}-${activityIndex}`;
    clearInterval(timers[timerId]);
    delete timers[timerId];
    document.getElementById(`timer-${timerId}`).textContent = '00:00:00';
}

function updateTimer(timerId, endTime) {
    const remainingTime = endTime - Date.now();

    if (remainingTime <= 0) {
        clearInterval(timers[timerId]);
        delete timers[timerId];
        document.getElementById(`timer-${timerId}`).textContent = '00:00:00';
        alert('Atividade concluída!');
    } else {
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        const formattedTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        document.getElementById(`timer-${timerId}`).textContent = formattedTime;
    }
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

