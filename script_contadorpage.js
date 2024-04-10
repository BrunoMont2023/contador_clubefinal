let groups = [];
let timerInterval = null;
let activityTime = 0;

function addGroup() {
    const groupName = prompt('Enter group name:');
    if (groupName) {
        groups.push({
            name: groupName,
            timeTaken: 0,
            intervalId: null
        });
        renderGroups();
    }
}

function renderGroups() {
    const groupsContainer = document.getElementById('groupsContainer');
    groupsContainer.innerHTML = '';
    groups.forEach((group, index) => {
        const groupElement = document.createElement('div');
        groupElement.classList.add('group');
        groupElement.innerHTML = `
            <h3>${group.name}</h3>
            <div class="group-info">
                Time Taken: <span id="groupTime${index}">00:00</span>
                <button onclick="pauseGroup(${index})">Pause</button>
            </div>
        `;
        groupsContainer.appendChild(groupElement);
    });
}

function startActivity() {
    activityTime = parseInt(document.getElementById('activityTime').value);
    if (!activityTime || activityTime <= 0) {
        alert('Please enter a valid activity time (minutes).');
        return;
    }
    groups.forEach((group, index) => {
        group.intervalId = setInterval(() => {
            group.timeTaken++;
            const timeElement = document.getElementById(`groupTime${index}`);
            timeElement.textContent = formatTime(group.timeTaken);
        }, 1000);
    });
    timerInterval = setTimeout(endActivity, activityTime * 60000);
}

function resetActivity() {
    clearTimeout(timerInterval);
    groups.forEach(group => {
        clearInterval(group.intervalId);
        group.timeTaken = 0;
    });
    renderGroups();
    clearScoreboard();
}

function pauseGroup(index) {
    const group = groups[index];
    if (group.intervalId) {
        clearInterval(group.intervalId);
        group.intervalId = null;
    }
}

function endActivity() {
    groups.forEach(group => {
        clearInterval(group.intervalId);
    });
    updateScoreboard();
}

function updateScoreboard() {
    const scoreboardBody = document.getElementById('scoreboardBody');
    scoreboardBody.innerHTML = '';
    const sortedGroups = groups.slice().sort((a, b) => a.timeTaken - b.timeTaken);
    sortedGroups.forEach((group, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${group.name}</td>
            <td>${formatTime(group.timeTaken)}</td>
            <td>${calculateScore(group.timeTaken)}</td>
        `;
        scoreboardBody.appendChild(row);
    });
}

function clearScoreboard() {
    const scoreboardBody = document.getElementById('scoreboardBody');
    scoreboardBody.innerHTML = '';
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function calculateScore(timeTaken) {
    // Customize scoring logic here (e.g., based on time taken)
    return Math.floor(100000 / timeTaken);
}

document.addEventListener('DOMContentLoaded', renderGroups);
