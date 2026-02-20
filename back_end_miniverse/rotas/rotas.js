const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path');
const produtosFile = path.join(__dirname, '../data/produtos.json');

router.get('/', (req, res) => {
    fs.readFile(produtosFile, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("Erro ao ler o arquivo");
            console.error("Erro ao ler o arquivo: \n", err);
            return;
        }
        try {
            const dadosJSON = JSON.parse(data);
            res.status(200).json(dadosJSON);
        }
        catch (error) {
            res.status(500).send("Erro ao converter o arquivo.");
            console.error("Erro ao converter o arquivo: \n", error);
        }
    });
});

router.get('/testenovo', (req, res) => {
    res.send('foi')
})
const carrinhoPath = path.join(__dirname, '../data/carrinho.json');


function readJSON(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data || '[]'); // garante que nunca retorne undefined
    } catch (error) {
        console.error('Erro ao ler arquivo JSON:', error);
        return [];
    }
}

const writeJSON = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
};

router.get('/carrinho', (req, res) => {
    console.log("endpoint do carrinho!!!")
    const carrinho = readJSON(carrinhoPath);
    console.log('📦 Conteúdo do carrinho enviado para o front:', carrinho);
    res.json(carrinho); // sempre envia JSON
});
// Rotas do carrinho

router.post('/carrinho', (req, res) => {
    const { id, nome, marca, preco, quantidade, tipo } = req.body;
    const carrinho = readJSON(carrinhoPath);

    // Itens especiais (planos e personalizações) já chegam com todos os dados
    if (tipo === 'plano' || tipo === 'personalizacao') {
        const itemExistente = carrinho.find((item) => item.id === id);
        if (itemExistente) {
            itemExistente.quantidade += (quantidade || 1);
        } else {
            carrinho.push({ id, nome, marca: marca || '', preco, quantidade: quantidade || 1, tipo });
        }
        writeJSON(carrinhoPath, carrinho);
        return res.status(201).json({ message: 'Item adicionado ao carrinho', carrinho });
    }

    // Fluxo original para produtos do catálogo
    const produtos = readJSON(produtosFile);
    const produto = produtos.find((p) => p.id === id);
    if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const itemExistente = carrinho.find((item) => item.id === id);
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            marca: produto.marca,
            preco: produto.preco,
            quantidade
        });
    }

    writeJSON(carrinhoPath, carrinho);
    res.status(201).json({ message: 'Produto adicionado ao carrinho', carrinho });
});

router.get('/:id', (req, res) => {
    const id_site = parseInt(req.params.id);
    fs.readFile(produtosFile, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("Erro ao ler o arquivo.");
            console.error("Erro ao ler o arquivo: \n", err);
            return;
        }
        try {
            const dadosJSON = JSON.parse(data);
            const idProcurado = dadosJSON.find(function (dado) {
                return dado.id == id_site;
            })
            res.status(200).send(idProcurado);
        }
        catch (error) {
            res.status(500).send("Erro ao converter o aruqivo.");
            console.error("Erro ao converter o arquivo: \n", error);
        }
    });
});

router.post('/criaproduto', (req, res) => {
    //curl -X POST -H "Content-Type: application/json" -d '{"id": 5, "descricao": "", "status": "teste"}' http://localhost:3000/criaproduto
    fs.readFile(produtosFile, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("Erro ao ler o arquivo.");
            console.error("Erro ao ler o arquivo: \n", err);
            return;
        }
        try {
            const dadosJSON = JSON.parse(data);
            const novoProduto = req.body;

            //Validações de produto
            if (novoProduto.marca == "") {
                res.status(400).send("A marca não foi declarada.")
            }
            if (novoProduto.nome == "") {
                res.status(400).send("O nome não foi declarado.")
            }
            if (novoProduto.preco = "") {
                res.status(400).send("Não foi informado o preço do produto.")
            }

            dadosJSON.push(novoProduto);
            fs.writeFile('./data/produtos.json', JSON.stringify(dadosJSON, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error("Erro ao gravar o arquivo: \n", err);
                }
                res.status(201).send("Produto adicionado com sucesso!!");
            });
        }
        catch (error) {
            res.status(500).send("Erro ao converter o arquivo.");
            console.error("Erro ao converter o arquivo: \n", error);
        }
    });
});

router.put('/:id', (req, res) => {
    //curl -X PUT -H "Content-Type: application/json" -d '{"descricao": "Testando PUT", "status": "teste"}' http://localhost:3000/listaDeTarefas/id
    const id_site = parseInt(req.params.id);
    const atualizaProduto = req.body;

    fs.readFile(produtosFile, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("Erro ao ler o arquivo.");
            console.error("Erro ao ler o arquivo: \n", err);
            return;
        }
        try {
            const dadosJSON = JSON.parse(data);
            const index = dadosJSON.findIndex(produto => produto.id === id_site);

            dadosJSON[index].descricao = atualizaProduto.descricao
            dadosJSON[index].preco = atualizaProduto.preco
            dadosJSON[index].nome = atualizaProduto.nome
            dadosJSON[index].marca = atualizaProduto.marca

            fs.writeFile('./data/produtos.json', JSON.stringify(dadosJSON, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error("Erro ao gravar o arquivo: \n", err);
                }
                res.status(201).send("Produto atualizado com sucesso")
            });
        }
        catch (error) {
            res.status(500).send("Erro ao converter o arquivo.");
            console.error("Erro ao converter o arquivo: \n", error);
        }
    });
});

router.delete('/:id', (req, res) => {
    //curl -X DELETE http://localhost:3000/listaDeTarefas/id
    const id_site = parseInt(req.params.id)
    fs.readFile(produtosFile, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send("Erro ao ler o arquivo.");
            console.error("Erro ao ler o arquivo: \n", err);
            return;
        }
        try {
            const dadosJSON = JSON.parse(data);
            const dadosIndex = dadosJSON.filter(produto => produto.id !== id_site)
            const jsonString = JSON.stringify(dadosIndex);
            fs.writeFile('./data/produtos.json', jsonString, 'utf8', (error) => {
                if (error) {
                    console.error("Erro ao ler o arquivo: \n", error)
                }
                res.status(200).send("Produto excluído com sucesso!!")
            });
        }
        catch (error) {
            res.status(500).send("Erro ao converter o arquivo.");
            console.error("Erro ao converter o arquivo: \n", error);
        }
    });
});




router.put('/carrinho/:id', (req, res) => {
    const { id } = req.params;
    const { quantidade } = req.body;
    const carrinho = readJSON(carrinhoPath);

    // Suporta IDs numéricos (produtos) e string (planos/personalizações)
    const parsedId = isNaN(id) ? id : parseInt(id);
    const item = carrinho.find((item) => item.id === parsedId);
    if (!item) {
        return res.status(404).json({ error: 'Item não encontrado no carrinho' });
    }

    item.quantidade = quantidade;
    writeJSON(carrinhoPath, carrinho);
    res.json({ message: 'Quantidade atualizada', carrinho });
});

router.delete('/carrinho/:id', (req, res) => {
    const { id } = req.params;
    let carrinho = readJSON(carrinhoPath);

    // Suporta IDs numéricos (produtos) e string (planos/personalizações)
    const parsedId = isNaN(id) ? id : parseInt(id);
    const itemIndex = carrinho.findIndex((item) => item.id === parsedId);
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item não encontrado no carrinho' });
    }

    carrinho.splice(itemIndex, 1);
    writeJSON(carrinhoPath, carrinho);
    res.json({ message: 'Item removido do carrinho', carrinho });
});




module.exports = router