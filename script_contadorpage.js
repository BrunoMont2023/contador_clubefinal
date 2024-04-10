let tempoTotalAtividade = 0;
let contadorGeralInterval = null;
let contadorGeralAtivo = false;
let grupos = [];

function formatarTempo(segundos) {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosFormatados = segundos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundosFormatados).padStart(2, '0')}`;
}

function personalizarTempo() {
    const horas = parseInt(document.getElementById('horas').value) || 0;
    const minutos = parseInt(document.getElementById('minutos').value) || 0;
    tempoTotalAtividade = horas * 3600 + minutos * 60;

    if (tempoTotalAtividade > 0) {
        document.getElementById('contadorAtividade').textContent = formatarTempo(tempoTotalAtividade);
    } else {
        alert("Por favor, insira um tempo válido para a atividade.");
    }
}

function iniciarOuPausarContador() {
    if (!contadorGeralAtivo && tempoTotalAtividade > 0) {
        iniciarContadorGeral();
    } else {
        pausarContadorGeral();
    }
}

function iniciarContadorGeral() {
    contadorGeralAtivo = true;
    contadorGeralInterval = setInterval(() => {
        tempoTotalAtividade--;
        document.getElementById('contadorAtividade').textContent = formatarTempo(tempoTotalAtividade);

        if (tempoTotalAtividade <= 0) {
            clearInterval(contadorGeralInterval);
            contadorGeralAtivo = false;
            alert("Tempo da atividade esgotado!");
            resetarContador();
        }
    }, 1000);

    iniciarContadoresIndividuais();
}

function pausarContadorGeral() {
    clearInterval(contadorGeralInterval);
    contadorGeralAtivo = false;
    pausarContadoresIndividuais();
}

function resetarContador() {
    clearInterval(contadorGeralInterval);
    contadorGeralAtivo = false;
    tempoTotalAtividade = 0;
    document.getElementById('contadorAtividade').textContent = '00:00:00';
    resetarContadoresIndividuais();
    resetarTabelaPontuacoes();
}

function adicionarGrupo() {
    const nomeGrupo = document.getElementById('nomeGrupo').value.trim();

    if (nomeGrupo) {
        const novoGrupo = {
            nome: nomeGrupo,
            tempo: 0,
            intervalo: null,
            concluido: false
        };

        grupos.push(novoGrupo);
        iniciarContadorIndividual(grupos.length - 1); // Iniciar contador individual para o novo grupo
        atualizarListaGrupos();
        document.getElementById('nomeGrupo').value = '';
    } else {
        alert("Por favor, insira um nome válido para o grupo.");
    }
}

function iniciarContadorIndividual(index) {
    if (index >= 0 && index < grupos.length) {
        const grupo = grupos[index];
        grupo.intervalo = setInterval(() => {
            grupo.tempo++;
            document.getElementById(`contadorGrupo${index}`).textContent = formatarTempo(grupo.tempo);
        }, 1000);
    }
}

function pausarContadoresIndividuais() {
    grupos.forEach((grupo, index) => {
        clearInterval(grupo.intervalo);
        grupo.intervalo = null;
    });
}

function resetarContadoresIndividuais() {
    grupos.forEach((grupo, index) => {
        grupo.tempo = 0;
        document.getElementById(`contadorGrupo${index}`).textContent = '00:00:00';
        grupo.concluido = false;
    });
}

function calcularPontuacao(tempo) {
    // Quanto menor o tempo, maior a pontuação
    return 10000 / tempo;
}

function atualizarListaGrupos() {
    const listaGrupos = document.getElementById('listaGrupos');
    listaGrupos.innerHTML = '';

    grupos.forEach((grupo, index) => {
        const divGrupo = document.createElement('div');
        divGrupo.innerHTML = `
            <strong>${grupo.nome}</strong>
            <span id="contadorGrupo${index}" class="contador">00:00:00</span>
            <button onclick="pausarContadorIndividual(${index})" ${grupo.concluido ? 'disabled' : ''}>Pausar</button>
        `;
        listaGrupos.appendChild(divGrupo);
    });
}

function resetarTabelaPontuacoes() {
    const tbody = document.getElementById('corpoTabela');
    tbody.innerHTML = '';
}

function atualizarTabelaPontuacoes() {
    const tbody = document.getElementById('corpoTabela');
    tbody.innerHTML = '';

    // Ordenar grupos por tempo (menor tempo primeiro)
    grupos.sort((a, b) => a.tempo - b.tempo);

    grupos.forEach((grupo, index) => {
        const newRow = tbody.insertRow();
        newRow.insertCell(0).textContent = index + 1;
        newRow.insertCell(1).textContent = grupo.nome;
        newRow.insertCell(2).textContent = formatarTempo(grupo.tempo);
        newRow.insertCell(3).textContent = calcularPontuacao(grupo.tempo).toFixed(2);
    });
}

document.addEventListener('DOMContentLoaded', atualizarListaGrupos);
