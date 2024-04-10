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

    // Resetar contadores individuais
    resetarContadoresIndividuais();

    // Limpar grupos e atualizar interface
    grupos = [];
    atualizarListaGrupos();
    atualizarTabelaPontuacoes();
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
        atualizarListaGrupos();
        document.getElementById('nomeGrupo').value = '';
    } else {
        alert("Por favor, insira um nome válido para o grupo.");
    }
}

function iniciarContadoresIndividuais() {
    grupos.forEach((grupo, index) => {
        grupo.intervalo = setInterval(() => {
            grupo.tempo++;
            document.getElementById(`contadorGrupo${index}`).textContent = formatarTempo(grupo.tempo);

            // Verificar se o grupo concluiu a atividade
            if (grupo.tempo >= tempoTotalAtividade) {
                grupo.concluido = true;
                pausarContadoresIndividuais(index);
            }
        }, 1000);
    });
}

function pausarContadoresIndividuais(index) {
    if (index >= 0 && index < grupos.length) {
        const grupo = grupos[index];
        if (grupo.intervalo) {
            clearInterval(grupo.intervalo);
            grupo.intervalo = null;

            // Calcular pontuação com base no tempo e posição
            grupo.pontuacao = calcularPontuacao(grupo.tempo);
            atualizarTabelaPontuacoes();
        }
    }
}

function resetarContadoresIndividuais() {
    grupos.forEach((grupo, index) => {
        clearInterval(grupo.intervalo);
        grupo.intervalo = null;
        grupo.tempo = 0;
        grupo.concluido = false;
        document.getElementById(`contadorGrupo${index}`).textContent = '00:00:00';
    });
}

function calcularPontuacao(tempo) {
    const tempoRestante = tempoTotalAtividade - tempo;
    const pontuacao = tempoRestante > 0 ? tempoRestante : 0;
    return pontuacao;
}

function atualizarListaGrupos() {
    const listaGrupos = document.getElementById('listaGrupos');
    listaGrupos.innerHTML = '';

    grupos.forEach((grupo, index) => {
        const divGrupo = document.createElement('div');
        divGrupo.innerHTML = `
            <strong>${grupo.nome}</strong>
            <span id="contadorGrupo${index}" class="contador">00:00:00</span>
            <button onclick="pausarContadoresIndividuais(${index})" ${grupo.concluido ? 'disabled' : ''}>Pausar</button>
        `;
        listaGrupos.appendChild(divGrupo);
    });
}

function atualizarTabelaPontuacoes() {
    const tabelaGrupos = document.getElementById('tabelaGrupos');
    const tbody = tabelaGrupos.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    // Ordenar grupos por pontuação (maior para menor)
    grupos.sort((a, b) => b.pontuacao - a.pontuacao);

    grupos.forEach((grupo, index) => {
        const newRow = tbody.insertRow();
        newRow.insertCell(0).textContent = index + 1;
        newRow.insertCell(1).textContent = grupo.nome;
        newRow.insertCell(2).textContent = formatarTempo(grupo.tempo);
        newRow.insertCell(3).textContent = grupo.pontuacao;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Atualizar lista de grupos ao carregar a página
    atualizarListaGrupos();
});
