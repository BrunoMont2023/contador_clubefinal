let groups = [];

function startActivity() {
    const activityName = document.getElementById('activityName').value.trim();
    const activityTime = parseInt(document.getElementById('activityTime').value, 10);
    
    if (!activityName) {
        alert('Please enter a valid activity name.');
        return;
    }

    if (isNaN(activityTime) || activityTime <= 0) {
        alert('Please enter a valid activity time (minutes).');
        return;
    }

    resetActivity();

    startCountdown(activityTime * 60);

    // Clear existing groups and render
    groups = [];
    renderGroups();

    // Add initial group
    addGroup();
}

function startCountdown(totalSeconds) {
    let secondsRemaining = totalSeconds;
    const countdownElement = document.getElementById('countdown');
    const timerInterval = setInterval(() => {
        secondsRemaining--;
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
    groups.forEach((group, index) => {
        const groupElement = document.createElement('div');
        groupElement.classList.add('group');
        groupElement.innerHTML = `
            <h3>Group ${index + 1}</h3>
            <p>Time taken: ${formatTime(group.timeTaken)}</p>
        `;
        groupsContainer.appendChild(groupElement);
    });
}

function addGroup() {
    const groupName = prompt('Enter group name:');
    if (groupName) {
        const newGroup = {
            name: groupName,
            timeTaken: 0
        };
        groups.push(newGroup);
        renderGroups();
    }
}

function endActivity() {
    updateScoreboard();
}

function updateScoreboard() {
    const scoreboardBody = document.getElementById('scoreboardBody');
    scoreboardBody.innerHTML = '';
    const sortedGroups = [...groups].sort((a, b) => a.timeTaken - b.timeTaken);
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

function calculateScore(position) {
    const maxScore = 1000;
    const decrement = 100;
    return maxScore - (position * decrement);
}

function resetActivity() {
    document.getElementById('countdown').textContent = '';
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

    // Simulate exporting data (e.g., to console)
    console.log(data);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
