const API_URL = 'http://localhost:3000/api';

// Função para adicionar itens ao carrinho
async function carregarCarrinho() {
    try{
        const response = await fetch(`${API_URL}/carrinho`);

        if(!response.ok){
            throw new Error('Erro ao carregar o carrinho!!');
        }

        const carrinho = await response.json();

        renderizarCarrinho(carrinho);
        atualizarTotal(carrinho);
    }
    catch(error){
        console.error("Erro ao carregar carrinho: ", error);

        const containerProdutos = document.querySelector('.produtos-c');
        containerProdutos.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #dc3545;">
                <h3>⚠️ Erro ao conectar com o servidor</h3>
                <p>Verifique se o back-end está rodando em http://localhost:3000</p>
                <p style="font-size: 14px; color: #666; margin-top: 20px;">
                    Execute: <code>cd back_end_miniverse && node server.js</code>
                </p>
                <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 20px">
                    Tentar novamente
                </button>
            </div> 
        `;
    }
}

// Função para renderizar os itens do carrinhona página
function renderizarCarrinho(itens){
    const containerProdutos = document.querySelector('.produtos-c');

    // Limpa o conteúdo atual
    containerProdutos.innerHTML = '';

    if(itens.length === 0){
        containerProdutos.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #666;">
                <h3>🛒 Seu carrinho está vazio</h3>
                <p>Adicione produtos para começar suas compras!</p>
                <a href="../html/produtos.html" class="btn btn-outline-success" style="margin-top: 20px;">
                    Ver produtos
                </a>
            </div>
        `;
        return;
    }
    itens.forEach((item, index) => {
        const produtoHTML = `
            <div class="produto-c" data-id="${item.id}">
                <div style="display: flex; align-items: center; width: 100%">
                    <div class="detalhesProd-c" style="flex: 1;">
                        <h1>${item.nome}</h1>
                        <p>${item.marca || 'Miniatura'}</p>
                        <div style="margin-top: 10px;">
                            <label>Quantidade: </label>
                            <input type="number"
                                value="${item.quantidade}"
                                min="1"
                                max="50"
                                class="form-control"
                                style="width: 80px; display: inline-block;"
                                onchange="atualizarQuantidade(${item.id}, this.value)">
                        </div>
                    </div>
                    <div style="margin-left: auto; margin-right: 20px; text-align: right;">
                        <h1>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</h1>
                        <p style="font-size: 14px; color: #666;">
                            ${item.quantidade}x R$ ${item.preco.toFixed(2).replace('.', ',')}
                        </p>
                        <button class="btn btn-danger btn-sm" onclick="removerDoCarrinho(${item.id})" style="margin-top: 10px;">
                            🗑️ Remover
                        </button>
                    </div>
                </div>
            </div>
            ${index < itens.length - 1 ? '<hr class="linha-c">' : ''} 
        `;//ler sobre a ultima linha ^

        containerProdutos.innerHTML += produtoHTML; //ler sobre
    });
}

// Função para atualizar o preço total
function atualizarTotal(itens){
    const total = itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

    const precoTotalElement = document.querySelector('.preco-total p');
    if(precoTotalElement) {
        precoTotalElement.innerHTML = `<b>R$ ${total.toFixed(2).replace('.', ',')}</b>`;
    }
}

// Função para atualizar a quantidade de um item
async function atualizarQuantidade(id, novaQuantidade) {
    novaQuantidade = parseInt(novaQuantidade);

    if(novaQuantidade < 1){
        alert('A quantidade mínima é 1!');
        await carregarCarrinho();
        return;
    }

    try{
        const response = await fetch(`${API_URL}/carrinho/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({quantidade: novaQuantidade})
        });

        if(response.ok) {
            await carregarCarrinho();
        }
        else{
            alert("Erro ao atualizar quantidade!");
        }
    }
    catch(error){
        console.error("Erro ao atualizar a quantidade: ", error);
        alert("Erro ao conectar com o servidor!");
    }
}

// Função para remover item do carrinho
async function removerDoCarrinho(id) {
    if(!confirm('Deseja remover este item do carrinho?')){
        return;
    }

    try{
        const response = await fetch(`${API_URL}/carrinho/${id}`, {
            method: 'DELETE'
        });

        if(response.ok) {
            await carregarCarrinho();
            mostrarNotificacao('Item removiddo do carrinho!', 'success!!');
        }
        else{
            alert('Erro ao remover item!');
        }
    }
    catch(error){
        console.error('Erro ai remover item: ', error);
        alert('Erro ao conectar com o servidor!');
    }
}

// Função para mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'success'){
    const notifcaAnterior = document.querySelector('.notificacao-carrinho');
    if(notifcaAnterior){
        notifcaAnterior.remove();
    }

    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao-carrinho';
    notificacao.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: ${tipo === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    notificacao.textContent = mensagem;

    document.body.appendChild(notificacao);

    setTimeout(() =>{
        notificacao.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

// Adicionar estilos de animação
if(!document.querySelector('#carrinho-animations')) {
    const style = document.createElement('style');
    style.id = 'carrinho-animations';
    style.textContent = `
        @keyframes slideIn{
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Função para finalizar compra
async function finalizarCompra() {
    try{
        const response = await fetch(`${API_URL}/carrinho`);
        const carrinho = await response.json();

        if(carrinho.length === 0){
            alert('Seu carrinho está vazio!');
            return;
        }

        // Mostra o modal
        const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
        modal.show();

        // Limpar carrinho após fechar o modal
        const btnFinalizar = document.querySelector('.modal-footer a button');
        if(btnFinalizar) {
            btnFinalizar.onclick = async () => {
                await limparCarrinho();
            };
        }
    }
    catch(error){
        console.error('Erro ao finalizar compra: ', error);
        alert('Erro ao conectar com o servidor!');
    }
}

// Função para limpar o carrinho
async function limparCarrinho() {
    try{ 
        const response = await fetch(`${API_URL}/carrinho`);
        const carrinho = await response.json();

        // Remove cada item
        for (const item of carrinho){
            await fetch(`${API_URL}/carrinho/${item.id}`, {
                method: 'DELETE'
            });
        }
    }
    catch(error){
        console.error('Erro ao limpar o carrinho: ', error);
    }
}

// Inicializar quando a página carregar
if(document.querySelector('.produtos-c')) {
    document.addEventListener('DOMContentLoaded', () =>{
        carregarCarrinho();
    });
}

// Função globais
window.atualizarQuantidade = atualizarQuantidade;
window.removerDoCarrinho = removerDoCarrinho;
window.finalizarCompra = finalizarCompra;