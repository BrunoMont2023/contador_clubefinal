let activityTimeInSeconds = 0;
let activityTimerInterval = null;
let groups = [];

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function startActivity() {
    const activityName = document.getElementById('activityName').value.trim();
    const activityHours = parseInt(document.getElementById('activityHours').value) || 0;
    const activityMinutes = parseInt(document.getElementById('activityMinutes').value) || 0;
    activityTimeInSeconds = activityHours * 3600 + activityMinutes * 60;

    if (activityName && activityTimeInSeconds > 0) {
        document.getElementById('activityTimer').textContent = formatTime(activityTimeInSeconds);
        startActivityTimer();
    } else {
        alert("Por favor, insira um nome e um tempo válido para a atividade.");
    }
}

function startActivityTimer() {
    activityTimerInterval = setInterval(() => {
        activityTimeInSeconds--;
        document.getElementById('activityTimer').textContent = formatTime(activityTimeInSeconds);

        if (activityTimeInSeconds <= 0) {
            clearInterval(activityTimerInterval);
            alert("Tempo da atividade esgotado!");
        }
    }, 1000);
}

function addGroup() {
    const groupName = document.getElementById('groupName').value.trim();

    if (groupName) {
        const group = {
            name: groupName,
            timeElapsed: 0,
            timerInterval: null
        };
        groups.push(group);
        updateGroupTimers();
        document.getElementById('groupName').value = '';
    } else {
        alert("Por favor, insira um nome válido para o grupo.");
    }
}

function updateGroupTimers() {
    const groupTimersContainer = document.getElementById('groupTimers');
    groupTimersContainer.innerHTML = '';

    groups.forEach((group, index) => {
        const groupTimerElement = document.createElement('div');
        groupTimerElement.classList.add('groupTimer');
        groupTimerElement.textContent = `${group.name}: ${formatTime(group.timeElapsed)}`;

        const pauseButton = document.createElement('button');
        pauseButton.textContent = 'Pausar';
        pauseButton.onclick = () => pauseGroupTimer(index);

        groupTimerElement.appendChild(pauseButton);
        groupTimersContainer.appendChild(groupTimerElement);

        startGroupTimer(index);
    });
}

function startGroupTimer(index) {
    const group = groups[index];
    if (group && !group.timerInterval) {
        group.timerInterval = setInterval(() => {
            group.timeElapsed++;
            updateGroupTimers();
        }, 1000);
    }
}

function pauseGroupTimer(index) {
    const group = groups[index];
    if (group && group.timerInterval) {
        clearInterval(group.timerInterval);
        group.timerInterval = null;
        updateGroupTimers();
    }
}

function exportToExcel() {
    const scoreBody = document.getElementById('scoreBody');
    scoreBody.innerHTML = '';

    // Sort groups by timeElapsed (ascending)
    groups.sort((a, b) => a.timeElapsed - b.timeElapsed);

    groups.forEach((group, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${group.name}</td>
            <td>${formatTime(group.timeElapsed)}</td>
            <td>${calculateScore(index)}</td>
        `;
        scoreBody.appendChild(row);
    });
}

function calculateScore(position) {
    const scores = [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100];
    if (position < scores.length) {
        return scores[position];
    }
    return 0;
}
