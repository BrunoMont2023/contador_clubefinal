let groups = [];
let timerInterval = null;
let totalTime = 0;
let scoreboard = [];

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
        }
    }, 1000);
}

function pauseActivity() {
    clearInterval(timerInterval);
    groups.forEach(group => {
        group.active = false;
        clearInterval(group.interval);
    });
    updateScoreboard();
}

function endActivity() {
    clearInterval(timerInterval);
    groups.forEach(group => {
        group.active = false;
        clearInterval(group.interval);
    });
    updateScoreboard();
}

function updateScoreboard() {
    scoreboard = groups.slice().sort((a, b) => a.time - b.time);
    const scoreboardBody = document.getElementById('scoreboardBody');
    scoreboardBody.innerHTML = '';
    scoreboard.forEach((group, index) => {
        const row = scoreboardBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = group.name;
        row.insertCell(2).textContent = formatTime(group.time);
        row.insertCell(3).textContent = calculateScore(group.time);
    });
}

function calculateScore(time) {
    // Example scoring logic (customize as needed)
    return 1000 - time; // Higher score for faster completion
}

function pauseGroup(index) {
    const group = groups[index];
    group.active = false;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', renderGroups);
