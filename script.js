document.addEventListener('DOMContentLoaded', function() {
    const enterButton = document.getElementById('enterButton');

    enterButton.addEventListener('click', function() {
        // Redirecionar para outra página ao clicar no botão
        window.location.href = 'outra_pagina.html'; // Substitua 'outra_pagina.html' pela URL desejada
    });
});
