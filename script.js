let activityIndex = 0;

function addActivity() {
    activityIndex++;
    const activitiesContainer = document.getElementById('activitiesContainer');

    const activityDiv = document.createElement('div');
    activityDiv.classList.add('activity');

    const activityNameInput = document.createElement('input');
    activityNameInput.type = 'text';
    activityNameInput.placeholder = 'Nome da Atividade';
    activityNameInput.classList.add('activity-name');

    const timerDisplay = document.createElement('div');
    timerDisplay.classList.add('timer');
    timerDisplay.textContent = '00:00:00';

    const startButton = document.createElement('button');
    startButton.textContent = 'Iniciar';
    startButton.onclick = () => startTimer(activityIndex, timerDisplay);

    const pauseButton = document.createElement('button');
    pauseButton.textContent = 'Pausar';
    pauseButton.onclick = () => pauseTimer(activityIndex);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reiniciar';
    resetButton.onclick = () => resetTimer(activityIndex, timerDisplay);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('delete');
    deleteButton.onclick = () => deleteActivity(activityDiv);

    activityDiv.appendChild(activityNameInput);
    activityDiv.appendChild(timerDisplay);
    activityDiv.appendChild(startButton);
    activityDiv.appendChild(pauseButton);
    activityDiv.appendChild(resetButton);
    activityDiv.appendChild(deleteButton);

    activitiesContainer.appendChild(activityDiv);
}

let timers = {};

function startTimer(activityIndex, timerDisplay) {
    const activityNameInput = document.querySelector(`.activity:nth-child(${activityIndex}) .activity-name`);
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
    timers[activityIndex] = setInterval(() => updateTimer(endTime, timerDisplay), 1000);
    updateActivityName(activityIndex, activityName);
}

function pauseTimer(activityIndex) {
    clearInterval(timers[activityIndex]);
}

function resetTimer(activityIndex, timer

