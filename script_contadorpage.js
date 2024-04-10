let activityName = '';
let activitySeconds = 0;
let countdownInterval = null;
let groups = [];

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function startActivity() {
    const hours = parseInt(document.getElementById('activityHours').value, 10) || 0;
    const minutes = parseInt(document.getElementById('activityMinutes').value, 10) || 0;
    activitySeconds = hours * 3600 + minutes * 60;

    activityName = document.getElementById('activityName').value.trim();
    if (activityName && activitySeconds > 0) {
        startCountdown();
    } else {
        alert('Por favor, preencha o nome da atividade e o tempo válido.');
    }
}

function startCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        activitySeconds--;
        if (activitySeconds < 0) {
            clearInterval(countdownInterval);
            alert('Tempo da atividade esgotado!');
            activitySeconds = 0;
        }
        renderGroups();
    }, 1000);
}

function addGroup() {
    const groupName = document.getElementById('groupName').value.trim();
    if (groupName) {
        groups.push({ name: groupName, completionTime: activitySeconds, currentTime: activitySeconds, interval: null });
        renderGroups();
        document.getElementById('groupName').value = '';
    } else {
        alert('Por favor, insira um nome válido para o grupo.');
    }
}

function toggleGroupTimer(index) {
    const group = groups[index];
    if (!group.interval) {
        group.interval = setInterval(() => {
            group.currentTime--;
            if (group.currentTime < 0) {
                clearInterval(group.interval);
                alert(`Grupo "${group.name}" terminou a atividade!`);
                group.currentTime = 0;
            }
            renderGroups();
        }, 1000);
    } else {
        clearInterval(group.interval);
        group.interval = null;
    }
}

function renderGroups() {
    const groupsContainer = document.getElementById('groups');
    groupsContainer.innerHTML = '';
    groups.forEach((group, index) => {
        const groupElement = document.createElement('div');
        groupElement.innerHTML = `
            <div>${group.name}: ${formatTime(group.currentTime)}</div>
            <button onclick="toggleGroupTimer(${index})">${group.interval ? 'Pausar' : 'Iniciar'}</button>
        `;
        groupsContainer.appendChild(groupElement);
    });
    updateScoreTable();
}

function updateScoreTable() {
    const scoreBody = document.getElementById('scoreBody');
    scoreBody.innerHTML = '';
    const sortedGroups = [...groups];
    sortedGroups.sort((a, b) => a.completionTime - b.completionTime);

    sortedGroups.forEach((group, index) => {
        const position = index + 1;
        const points = 1000 - (position - 1) * 100;
        const row = `<tr>
            <td>${position}</td>
            <td>${group.name}</td>
            <td>${formatTime(group.completionTime)}</td>
            <td>${points}</td>
        </tr>`;
        scoreBody.innerHTML += row;
    });
}

function exportToExcel() {
    const data = [['Posição', 'Nome do Grupo', 'Tempo de Conclusão', 'Pontuação']];
    groups.forEach((group, index) => {
        const position = index + 1;
        const points = 1000 - (position - 1) * 100;
        data.push([position, group.name, formatTime(group.completionTime), points]);
    });

    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activityName}_pontuacoes.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
