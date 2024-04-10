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
    limparTabelaPontuacoes(); // Limpar a tabela de pontuações ao resetar
}

function adicionarGrupo() {
    const nomeGrupo = document.getElementById('nomeGrupo').value.trim();

    if (nomeGrupo) {
        const novoGrupo = {
            nome: nomeGrupo,
            tempo: 0,
            intervalo: null,
            concluido: false // Inicialmente não concluído
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
        if (!grupo.concluido) { // Iniciar apenas se não estiver concluído
            grupo.intervalo = setInterval(() => {
                grupo.tempo++;
                document.getElementById(`contadorGrupo${index}`).textContent = formatarTempo(grupo.tempo);
            }, 1000);
        }
    });
}

function pausarContadoresIndividuais(index) {
    if (index >= 0 && index < grupos.length) {
        const grupo = grupos[index];
        if (grupo.intervalo && !grupo.concluido) {
            clearInterval(grupo.intervalo);
            grupo.intervalo = null;
            
            // Verificar se o grupo concluiu a atividade
            if (grupo.tempo >= tempoTotalAtividade) {
                grupo.concluido = true;
                calcularPontuacao(); // Recalcular pontuação ao concluir
            }
        }
    }
}

function resetarContadoresIndividuais() {
    grupos.forEach((grupo, index) => {
        grupo.tempo = 0;
        document.getElementById(`contadorGrupo${index}`).textContent = '00:00:00';
        grupo.concluido = false; // Marcar como não concluído ao resetar
    });
}

function calcularPontuacao() {
    const pontuacoes = [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100];
    const gruposConcluidos = grupos.filter(grupo => grupo.concluido);

    // Ordenar grupos concluídos por tempo (menor tempo primeiro)
    gruposConcluidos.sort((a, b) => a.tempo - b.tempo);

    gruposConcluidos.forEach((grupo, index) => {
        grupo.pontuacao = pontuacoes[index] || 0; // Atribuir pontuação com base na posição
    });

    atualizarTabelaPontuacoes(); // Atualizar a tabela de pontuações
}

function atualizarListaGrupos() {
    const listaGrupos = document.getElementById('listaGrupos');
    listaGrupos.innerHTML = '';

    grupos.forEach((grupo, index) => {
        const divGrupo = document.createElement('div');
        divGrupo.innerHTML = `
            <strong>${grupo.nome}</strong>
            <span id="contadorGrupo${index}" class="contador">00:00:00</span>
            <button onclick="pausarContadoresIndividuais(${index})">Pausar</button>
        `;
        listaGrupos.appendChild(divGrupo);
    });
}

function limparTabelaPontuacoes() {
    const tabelaGrupos = document.getElementById('tabelaGrupos');
    const tbody = tabelaGrupos.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
}

function atualizarTabelaPontuacoes() {
    const tabelaGrupos = document.getElementById('tabelaGrupos');
    const tbody = tabelaGrupos.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    const gruposConcluidos = grupos.filter(grupo => grupo.concluido);

    gruposConcluidos.forEach((grupo, index) => {
        const newRow = tbody.insertRow();
        newRow.insertCell(0).textContent = index + 1;
        newRow.insertCell(1).textContent = grupo.nome;
        newRow.insertCell(2).textContent = formatarTempo(grupo.tempo);
        newRow.insertCell(3).textContent = grupo.pontuacao;
    });
}

document.addEventListener('DOMContentLoaded', atualizarListaGrupos);

function exportarDados() {
    // Preparar os dados como uma matriz de objetos
    const dados = grupos.map((grupo, index) => ({
        Posição: index + 1,
        'Nome do Grupo': grupo.nome,
        Tempo: formatarTempo(grupo.tempo),
        Pontuação: grupo.pontuacao
    }));

    // Estilos CSS para a tabela
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

    // Converter os dados para formato de tabela HTML
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

    // Criar um objeto Blob com o conteúdo da tabela HTML
    const blob = new Blob([tabelaHtml], { type: 'text/html;charset=utf-8;' });

    // Criar um link para fazer o download do arquivo HTML
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'pontuacoes.html');

    // Simular um clique no link para iniciar o download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
