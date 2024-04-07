let countdownInterval;
let countdownPaused = false;
let countdownEndTime;
let remainingTime;

function startCountdown() {
    if (!countdownEndTime) {
        // Defina a data final para o contador (por exemplo, 30 minutos a partir de agora)
        countdownEndTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    }

    if (!countdownInterval) {
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    countdownPaused = false;

    // Atualizar estado dos botões
    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
}

function pauseCountdown() {
    countdownPaused = true;

    // Atualizar estado dos botões
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('resetBtn').disabled = false;
}

function resetCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    countdownEndTime = null;
    countdownPaused = false;
    updateCountdown();

    // Atualizar estado dos botões
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;
}

function updateCountdown() {
    if (!countdownEndTime) return;

    const now = new Date().getTime();
    remainingTime = countdownEndTime - now;

    if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        document.getElementById('timer').innerHTML = 'EXPIRADO';

        // Atualizar estado dos botões
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('resetBtn').disabled = false;
    } else {
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        document.getElementById('timer').innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
}

// Iniciar o contador quando a página carregar
window.onload = function() {
    resetCountdown(); // Reiniciar o contador ao carregar a página
};

            
            document.getElementById('countdown').innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
}

countdown(); // Iniciar o contador regressivo
