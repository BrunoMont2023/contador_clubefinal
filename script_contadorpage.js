let groups = [];
let scoreboard = [];
let timerInterval = null;
let totalTime = 0;

function addGroup() {
    const groupName = document.getElementById('groupName').value.trim();
    if (groupName) {
        groups.push({
            name: groupName,
            time: 0,
            interval: null,
            active: false
        });
        renderGroups();
        document.getElementById('groupName').value = '';
    }
}

function renderGroups() {
    const groupContainer = document.getElementById('groupContainer');
    groupContainer.innerHTML = '';
    groups.forEach((group, index) => {
        const groupBox = document.createElement('div');
        groupBox.classList.add('group-box');
        groupBox.innerHTML = `
            <h3>${group.name}</h3>
            <span id="groupTime${index}">${formatTime(group.time)}</span>
            <button onclick="pauseGroup(${index})">Pause</button>
        `;
        groupContainer.appendChild(groupBox);
    });
}

function startActivity() {
    if (groups.length === 0) {
        alert("Please add at least one group.");
        return;
    }
    totalTime = 60; // Set total time in seconds (change as needed)
    startTimer();
    groups.forEach(group => {
        group.active = true;
        startGroupTimer(group);
    });
}

function startTimer() {
    timerInterval = setInterval(() => {
        totalTime--;
        renderGroups();
        if (totalTime <= 0) {
            endActivity();
        }
    }, 1000);
}

function startGroupTimer(group) {
    group.interval = setInterval(() => {
        if (group.active) {
            group.time++;
            document.getElementById(`groupTime${groups.indexOf(group)}`).textContent = formatTime(group.time);
        }
    }, 1000);
}

function pauseGroup(index) {
    const group = groups[index];
    if (group.interval) {
        clearInterval(group.interval);
        group.interval = null;
        group.active = false;
        updateScoreboard();
    }
}

function endActivity() {
    clearInterval(timerInterval);
    updateScoreboard();
}

function updateScoreboard() {
    scoreboard = groups.slice().sort((a, b) => a.time - b.time);
    const scoreboardBody = document.getElementById('scoreboardBody');
    scoreboardBody.innerHTML = '';
    scoreboard.forEach((group, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${group.name}</td>
            <td>${formatTime(group.time)}</td>
            <td>${calculateScore(group.time)}</td>
        `;
        scoreboardBody.appendChild(row);
    });
}

function calculateScore(time) {
    // Example scoring logic (adjust as needed)
    return Math.floor(100000 / time);
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
