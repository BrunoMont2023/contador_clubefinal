let groups = [];
let scoreboard = [];

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
            <div class="group-info">Time Taken: <span id="groupTime${index}">00:00</span></div>
        `;
        groupsContainer.appendChild(groupElement);
    });
}

function startActivity() {
    const activityTime = parseInt(document.getElementById('activityTime').value);
    if (activityTime && activityTime > 0) {
        groups.forEach((group, index) => {
            group.intervalId = setInterval(() => {
                group.timeTaken++;
                const timeElement = document.getElementById(`groupTime${index}`);
                timeElement.textContent = formatTime(group.timeTaken);
            }, 1000);
        });
        setTimeout(endActivity, activityTime * 60000); // End activity after specified minutes
    } else {
        alert('Please enter a valid activity time (minutes).');
    }
}

function endActivity() {
    groups.forEach(group => {
        clearInterval(group.intervalId);
    });
    updateScoreboard();
}

function updateScoreboard() {
    scoreboard = groups.slice().sort((a, b) => a.timeTaken - b.timeTaken);
    const scoreboardBody = document.getElementById('scoreboardBody');
    scoreboardBody.innerHTML = '';
    scoreboard.forEach((group, index) => {
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

function calculateScore(timeTaken) {
    // Customize scoring logic as needed
    return Math.floor(100000 / timeTaken);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', renderGroups);
