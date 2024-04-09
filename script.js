document.addEventListener('DOMContentLoaded', function() {
    const enterButton = document.getElementById('enterButton');

    enterButton.addEventListener('click', function() {
        // Redirecionar para outra página ao clicar no botão
        window.location.href = 'contadorpage.html'; // Substitua 'outra_pagina.html' pela URL desejada
    });
});
// scripts.js (arquivo compartilhado entre páginas)

function iniciarContador() {
    // Lógica para iniciar o contador geral
}

function pausarContador() {
    // Lógica para pausar o contador geral
}

function resetarContador() {
    // Lógica para resetar o contador geral
}

function iniciarContadorGrupo(numeroGrupo) {
    // Lógica para iniciar o contador do grupo específico
}

function pausarContadorGrupo(numeroGrupo) {
    // Lógica para pausar o contador do grupo específico
}

function resetarContadorGrupo(numeroGrupo) {
    // Lógica para resetar o contador do grupo específico
}

// Outras funções compartilhadas entre páginas
