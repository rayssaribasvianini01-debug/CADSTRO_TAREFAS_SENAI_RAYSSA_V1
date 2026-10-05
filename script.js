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

const botaoAdicionar = document.getElementById("botao-adicionar");
const campoTarefa = document.getElementById("campo-tarefa");

botaoAdicionar.addEventListener("click", adicionarNovaTarefa);

campoTarefa.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        adicionarNovaTarefa();
    }
});

function adicionarNovaTarefa() {
    const descricaoInput = campoTarefa.value;

    try {
        const novaTarefa = new Tarefa(descricaoInput);
        listaDeTarefas.push(novaTarefa);
        renderizarLista();
        campoTarefa.value = "";
        campoTarefa.focus();
    } catch (erro) {
        alert(erro.message);
    }
}

function renderizarLista() {
    const listaUl = document.getElementById("lista-tarefas");
    listaUl.innerHTML = "";

    listaDeTarefas.forEach((tarefa, index) => {
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
    const total = listaDeTarefas.length;

    if (total === 1) {
        contadorElemento.textContent = "1 tarefa na lista";
    } else {
        contadorElemento.textContent = `${total} tarefas na lista`;
    }
}

function alternarConclusao(index) {
    listaDeTarefas[index].alternarStatus();
    renderizarLista();
}

function removerTarefa(index) {
    listaDeTarefas.splice(index, 1);
    renderizarLista();
}

const botaoTema = document.getElementById("botao-alterar-tema");

botaoTema.addEventListener("click", () => {
    document.body.classList.toggle("modo-escuro");

    const icone = botaoTema.querySelector("i");
    if (document.body.classList.contains("modo-escuro")) {
        icone.className = "fa-solid fa-sun";
    } else {
        icone.className = "fa-solid fa-moon";
    }
});

