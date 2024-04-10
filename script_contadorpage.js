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
}

function adicionarGrupo() {
    const nomeGrupo = document.getElementById('nomeGrupo').value.trim();

    if (nomeGrupo) {
        const novoGrupo = {
            nome: nomeGrupo,
            tempo: 0,
            intervalo: null
        };

        grupos.push(novoGrupo);
        atualizarListaGrupos();
        document.getElementById('nomeGrupo').value = '';
    } else {
        alert("Por favor, insira um nome válido para o grupo.");
    }
}

function iniciarContadoresIndividuais() {
    grupos.forEach((grupo, index) => {
        if (!grupo.concluido) {
            grupo.intervalo = setInterval(() => {
                grupo.tempo++;
                document.getElementById(`contadorGrupo${index}`).textContent = formatarTempo(grupo.tempo);

                if (grupo.tempo >= tempoTotalAtividade) {
                    grupo.concluido = true;
                    pausarContadoresIndividuais();
                    calcularPontuacao();
                }
            }, 1000);
        }
    });
}

function pausarContadoresIndividuais() {
    grupos.forEach((grupo, index) => {
        if (grupo.intervalo) {
            clearInterval(grupo.intervalo);
            grupo.intervalo = null;
        }
    });
}

function resetarContadoresIndividuais() {
    grupos.forEach((grupo, index) => {
        grupo.tempo = 0;
        document.getElementById(`contadorGrupo${index}`).textContent = '00:00:00';
        grupo.concluido = false;
    });
}

function calcularPontuacao() {
    grupos.sort((a, b) => a.tempo - b.tempo); // Ordenar grupos pelo tempo crescente

    grupos.forEach((grupo, index) => {
        grupo.pontuacao = 1000 - index * 100; // Atribuir pontuação decrescente
    });

    atualizarTabelaPontuacoes();
}

function atualizarListaGrupos() {
    const listaGrupos = document.getElementById('listaGrupos');
    listaGrupos.innerHTML = '';

    grupos.forEach((grupo, index) => {
        const divGrupo = document.createElement('div');
        divGrupo.classList.add('grupo');
        divGrupo.innerHTML = `
            <strong>${grupo.nome}</strong>
            <div class="contador" id="contadorGrupo${index}">00:00:00</div>
        `;
        listaGrupos.appendChild(divGrupo);
    });
}

function atualizarTabelaPontuacoes() {
    const tbody = document.querySelector('#tabelaGrupos tbody');
    tbody.innerHTML = '';

    grupos.forEach((grupo, index) => {
        const newRow = tbody.insertRow();
        newRow.insertCell(0).textContent = index + 1;
        newRow.insertCell(1).textContent = grupo.nome;
        newRow.insertCell(2).textContent = formatarTempo(grupo.tempo);
        newRow.insertCell(3).textContent = grupo.pontuacao;
    });
}

document.addEventListener('DOMContentLoaded', atualizarListaGrupos);
