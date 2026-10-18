class Tarefa {
    constructor(descricao) {
        if (descricao.trim() === "") {
            throw new Error("A descrição da tarefa não pode estar em branco.");
        }
        this.descricao = descricao;
        this.concluida = false;
    }

    alternarStatus() {
        this.concluida = !this.concluida;
    }
}

const listaDeTarefas = [];
const CHAVE_STORAGE = "sistema_lista_tarefas";
const CHAVE_TEMA = "sistema_modo_escuro";
let filtroAtual = "todas";

function salvarNoLocalStorage() {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(listaDeTarefas));
}

function carregarDoLocalStorage() {
    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE);
    if (dadosSalvos) {
        const tarefasObjetos = JSON.parse(dadosSalvos);
        tarefasObjetos.forEach((t) => {
            const tarefaInstanciada = new Tarefa(t.descricao);
            tarefaInstanciada.concluida = t.concluida;
            listaDeTarefas.push(tarefaInstanciada);
        });
    }

    const modoEscuroSalvo = localStorage.getItem(CHAVE_TEMA);
    if (modoEscuroSalvo === "true") {
        document.body.classList.add("modo-escuro");
        const icone = document.querySelector("#botao-alterar-tema i");
        if (icone) {
            icone.className = "fa-solid fa-sun";
        }
    }
}

const botaoAdicionar = document.getElementById("botao-adicionar");
const campoTarefa = document.getElementById("campo-tarefa");

if (botaoAdicionar) {
    botaoAdicionar.addEventListener("click", adicionarNovaTarefa);
}

if (campoTarefa) {
    campoTarefa.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            adicionarNovaTarefa();
        }
    });
}

function adicionarNovaTarefa() {
    if (!campoTarefa) return;
    const descricaoInput = campoTarefa.value;

    try {
        const novaTarefa = new Tarefa(descricaoInput);
        listaDeTarefas.push(novaTarefa);
        salvarNoLocalStorage();
        renderizarLista();
        campoTarefa.value = "";
        campoTarefa.focus();
    } catch (erro) {
        alert(erro.message);
    }
}

function renderizarLista() {
    const listaUl = document.getElementById("lista-tarefas");
    if (!listaUl) return;

    listaUl.innerHTML = "";

    listaDeTarefas.forEach((tarefa, index) => {
        if (filtroAtual === "pendentes" && tarefa.concluida) return;
        if (filtroAtual === "concluidas" && !tarefa.concluida) return;

        const itemLista = document.createElement("li");
        itemLista.className = "item-tarefa";

        if (tarefa.concluida) {
            itemLista.classList.add("concluido");
        }

        itemLista.innerHTML = `
            <span class="texto-tarefa" onclick="alternarConclusao(${index})">${tarefa.descricao}</span>
            <div class="acoes-tarefa">
                <button class="botao-acao" onclick="alternarConclusao(${index})">
                    <i class="fa-regular ${tarefa.concluida ? 'fa-circle-check' : 'fa-circle'}"></i>
                </button>
                <button class="botao-acao excluir" onclick="removerTarefa(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        listaUl.appendChild(itemLista);
    });

    atualizarContador();
}

function atualizarContador() {
    const contadorElemento = document.getElementById("contador-tarefas");
    
    // Evita o erro 'Cannot set properties of null'
    if (!contadorElemento) return;

    let total = listaDeTarefas.length;
    if (filtroAtual === "pendentes") {
        total = listaDeTarefas.filter(t => !t.concluida).length;
    } else if (filtroAtual === "concluidas") {
        total = listaDeTarefas.filter(t => t.concluida).length;
    }

    if (total === 1) {
        contadorElemento.textContent = "1 tarefa na lista";
    } else {
        contadorElemento.textContent = `${total} tarefas na lista`;
    }
}

function alternarConclusao(index) {
    listaDeTarefas[index].alternarStatus();
    salvarNoLocalStorage();
    renderizarLista();
}

function removerTarefa(index) {
    listaDeTarefas.splice(index, 1);
    salvarNoLocalStorage();
    renderizarLista();
}

const botaoTema = document.getElementById("botao-alterar-tema");

if (botaoTema) {
    botaoTema.addEventListener("click", () => {
        document.body.classList.toggle("modo-escuro");

        const icone = botaoTema.querySelector("i");
        const estaEscuro = document.body.classList.contains("modo-escuro");
        
        if (icone) {
            if (estaEscuro) {
                icone.className = "fa-solid fa-sun";
            } else {
                icone.className = "fa-solid fa-moon";
            }
        }

        localStorage.setItem(CHAVE_TEMA, estaEscuro);
    });
}

// Funcionalidade dos Filtros
const botoesFiltro = document.querySelectorAll(".filtro-btn");

botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
        botoesFiltro.forEach((btn) => btn.classList.remove("ativo"));
        botao.classList.add("ativo");

        const textoBotao = botao.innerText.trim().toLowerCase();
        if (textoBotao.includes("pendente")) {
            filtroAtual = "pendentes";
        } else if (textoBotao.includes("concl")) {
            filtroAtual = "concluidas";
        } else {
            filtroAtual = "todas";
        }

        renderizarLista();
    });
});

// Inicialização
carregarDoLocalStorage();
renderizarLista();