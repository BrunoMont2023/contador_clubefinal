let groups = [];
let timerInterval = null;
let activityTime = 0;

function setActivityTime(minutes) {
    document.getElementById('activityTime').value = minutes;
}

function startActivity() {
    const activityName = document.getElementById('activityName').value;
    activityTime = parseInt(document.getElementById('activityTime').value);
    if (!activityTime || activityTime <= 0) {
        alert('Please enter a valid activity time (minutes).');
        return;
    }
    document.getElementById('activityTitle').textContent = activityName || 'Activity Timer';
    startCountdown(activityTime * 60); // Convert minutes to seconds
    renderGroups();
}

function startCountdown(totalSeconds) {
    let secondsRemaining = totalSeconds;
    timerInterval = setInterval(() => {
        secondsRemaining--;
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = `Time Remaining: ${formatTime(secondsRemaining)}`;
        if (secondsRemaining <= 0) {
            clearInterval(timerInterval);
            endActivity();
        }
    }, 1000);
}

function renderGroups() {
    const groupsContainer = document.getElementById('groupsContainer');
    groupsContainer.innerHTML = '';
    const groupName = prompt('Enter group name:');
    if (groupName) {
        groups.push({
            name: groupName,
            timeTaken: 0,
            intervalId: setInterval(() => {
                groups.forEach((group, index) => {
                    group.timeTaken++;
                    renderGroups();
                });
            }, 1000)
        });
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
            <td>${calculateScore(index)}</td>
        `;
        scoreboardBody.appendChild(row);
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function calculateScore(position) {
    const maxScore = 1000;
    const decrement = 100;
    return maxScore - (position * decrement);
}

function resetActivity() {
    clearInterval(timerInterval);
    groups = [];
    activityTime = 0;
    document.getElementById('activityName').value = '';
    document.getElementById('activityTime').value = '';
    document.getElementById('activityTitle').textContent = 'Activity Timer';
    document.getElementById('countdown').textContent = '';
    document.getElementById('groupsContainer').innerHTML = '';
    document.getElementById('scoreboardBody').innerHTML = '';
}

function exportData() {
    const data = {
        activityName: document.getElementById('activityName').value,
        groups: groups.map(group => ({
            name: group.name,
            timeTaken: formatTime(group.timeTaken),
            position: groups.indexOf(group) + 1,
            score: calculateScore(groups.indexOf(group))
        }))
    };

    // Simulate exporting data (e.g., to Excel format)
    console.log(data);
}
