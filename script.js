function updateCountdown() {
    if (!countdownEndTime) return;

    const now = new Date().getTime();
    remainingTime = countdownEndTime - now;

    if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        document.getElementById('timer').innerHTML = '<span style="font-size: 3rem;">EXPIRADO</span>';

        // Atualizar estado dos botões
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('resetBtn').disabled = false;
    } else {
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        // Formatar os números do contador com tamanho de fonte grande
        const formattedTime = `<span style="font-size: 3rem;">${days}d ${hours}h ${minutes}m ${seconds}s</span>`;
        document.getElementById('timer').innerHTML = formattedTime;
    }
}

