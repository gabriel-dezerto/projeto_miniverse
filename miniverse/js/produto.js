const API_URL = 'http://localhost:3000/listaprodutos';

// Função para adicionar produto ao carrinho
async function adicionarAoCarrinho(produtoId, quantidade = 1) {
    try {
        const response = await fetch(`${API_URL}/carrinho`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: produtoId,
                quantidade: quantidade
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Feedback visual de sucesso
            mostrarNotificacao('✅ Produto adicionado ao carrinho!', 'success');
            
            // Atualizar contador do carrinho
            atualizarContadorCarrinho();
            
        } else {
            const error = await response.json();
            mostrarNotificacao('❌ ' + (error.error || 'Erro ao adicionar produto'), 'error');
        }
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        mostrarNotificacao('❌ Erro ao conectar com o servidor. Verifique se está rodando em http://localhost:3000', 'error');
    }
}

// Função para mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'success') {
    // Remove notificação anterior se existir
    const notifAnterior = document.querySelector('.notificacao-carrinho');
    if (notifAnterior) {
        notifAnterior.remove();
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
        max-width: 350px;
    `;
    notificacao.textContent = mensagem;
    
    document.body.appendChild(notificacao);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

// Adicionar estilos de animação
if (!document.querySelector('#carrinho-animations')) {
    const style = document.createElement('style');
    style.id = 'carrinho-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Função para atualizar contador do carrinho no header
async function atualizarContadorCarrinho() {
    try {
        const response = await fetch(`${API_URL}/carrinho`);
        const carrinho = await response.json();
        
        const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
        
        // Procura pelo ícone do carrinho e adiciona badge
        const carrinhoIcon = document.querySelector('a[href*="carrinho.html"]');
        if (carrinhoIcon) {
            let badge = carrinhoIcon.querySelector('.badge-carrinho');
            
            if (totalItens > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'badge-carrinho';
                    badge.style.cssText = `
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        background-color: #dc3545;
                        color: white;
                        border-radius: 50%;
                        padding: 2px 6px;
                        font-size: 12px;
                        font-weight: bold;
                        min-width: 20px;
                        text-align: center;
                    `;
                    carrinhoIcon.style.position = 'relative';
                    carrinhoIcon.appendChild(badge);
                }
                badge.textContent = totalItens;
            } else if (badge) {
                badge.remove();
            }
        }
    } catch (error) {
        console.error('Erro ao atualizar contador:', error);
    }
}

// Configurar botões de compra nas páginas de produtos
document.addEventListener('DOMContentLoaded', () => {
    const botaoComprar = document.querySelector('.botao-comprar');
    
    if (botaoComprar) {
        botaoComprar.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Pega o ID do produto da página (do código exibido)
            const codigoElement = document.querySelector('.informacoes p');
            if (codigoElement) {
                const textoCompleto = codigoElement.textContent;
                const codigo = textoCompleto.replace('Código: ', '').trim();
                const produtoId = parseInt(codigo);
                
                // Pega a quantidade selecionada
                const quantidadeSelect = document.querySelector('.select_quantidade');
                const quantidade = quantidadeSelect ? parseInt(quantidadeSelect.value) : 1;
                
                console.log(`Adicionando produto ${produtoId} - Quantidade: ${quantidade}`);
                
                await adicionarAoCarrinho(produtoId, quantidade);
            } else {
                mostrarNotificacao('❌ Erro: Código do produto não encontrado', 'error');
            }
        });
    }
    
    // Atualizar contador ao carregar a página
    atualizarContadorCarrinho();
});

// Tornar função global
window.adicionarAoCarrinho = adicionarAoCarrinho;