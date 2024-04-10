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
        grupo.concluido = true; // Marca o grupo como concluído ao pausar o contador
    });
}

function resetarContadoresIndividuais() {
    grupos.forEach((grupo, index) => {
        grupo.tempo = 0;
        document.getElementById(`contadorGrupo${index}`).textContent = '00:00:00';
        grupo.concluido = false; // Reinicia o status do grupo
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

function exportarDados() {
    const dados = grupos.map((grupo, index) => ({
        Posição: index + 1,
        'Nome do Grupo': grupo.nome,
        Tempo: formatarTempo(grupo.tempo),
        Pontuação: calcularPontuacao(grupo.tempo).toFixed(2)
    }));

    const cssStyles = `
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
                font-family: Arial, sans-serif;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #007bff;
                color: white;
            }
            tr:nth-child(even) {
                background-color: #f2f2f2;
            }
        </style>
    `;

    const tabelaHtml = `
        ${cssStyles}
        <table>
            <thead>
                <tr>
                    <th>Posição</th>
                    <th>Nome do Grupo</th>
                    <th>Tempo</th>
                    <th>Pontuação</th>
                </tr>
            </thead>
            <tbody>
                ${dados.map(grupo =>
                    `<tr>
                        <td>${grupo['Posição']}</td>
                        <td>${grupo['Nome do Grupo']}</td>
                        <td>${grupo['Tempo']}</td>
                        <td>${grupo['Pontuação']}</td>
                    </tr>`
                ).join('')}
            </tbody>
        </table>
        <button onclick="window.print()">Imprimir Página</button>
    `;

    const blob = new Blob([tabelaHtml], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'pontuacoes.html');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Inicialização da lista de grupos ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarListaGrupos);
