const express = require('express')
const router = express.Router()
const fs = require('fs')

router.get('/',(req,res) =>{
    fs.readFile('./data/produtos.json', 'utf8', (err, data) =>{
        if(err){
            res.status(500).send("Erro ao ler o arquivo");
            console.error("Erro ao ler o arquivo: \n", err);
            return;
        }
        try{
            const dadosJSON = JSON.parse(data);
            res.status(200).json(dadosJSON);
        }
        catch(error){
            res.status(500).send("Erro ao converter o arquivo.");
            console.error("Erro ao converter o arquivo: \n", error);
        }
    });
});

router.get('/:id', (req,res) =>{
    const id_site = parseInt(req.params.id);
    fs.readFile('./data/produtos.json', 'utf8', (err,data) =>{
        if(err){
            res.status(500).send("Erro ao ler o arquivo.");
            console.error("Erro ao ler o arquivo: \n", err);
            return;
        }
        try{
            const dadosJSON = JSON.parse(data);
            const idProcurado = dadosJSON.find(function (dado){
                return dado.id == id_site;
            })
            res.status(200).send(idProcurado);
        }
        catch(error){
            res.status(500).send("Erro ao converter o aruqivo.");
            console.error("Erro ao converter o arquivo: \n", error);
        }
    });
});

router.post('/criaproduto', (req, res) =>{
//curl -X POST -H "Content-Type: application/json" -d '{"id": 5, "descricao": "", "status": "teste"}' http://localhost:3000/listaDeTarefas/criaproduto
    fs.readFile('./data/produtos.json', 'utf8', (err, data) =>{
        if(err){
            res.status(500).send("Erro ao ler o arquivo.");
            console.error("Erro ao ler o arquivo: \n", err);
            return;
        }
        try{
            const dadosJSON = JSON.parse(data);
            const novoProduto = req.body;

            //Validações de produto
            if(novoProduto.marca == ""){
                res.status(400).send("A marca não foi declarada.")
            }
            if(novoProduto.nome == ""){
                res.status(400).send("O nome não foi declarado.")
            }
            if(novoProduto.preco = ""){
                res.status(400).send("Não foi informado o preço do produto.")
            }
            
            dadosJSON.push(novoProduto);
            fs.writeFile('./data/produtos.json', JSON.stringify(dadosJSON, null, 2), 'utf8', (err) =>{
                if(err){
                    console.error("Erro ao gravar o arquivo: \n", err);
                }
                res.status(201).send("Produto adicionado com sucesso!!");
            });
        }
        catch (error){
            res.status(500).send("Erro ao converter o arquivo.");
            console.error("Erro ao converter o arquivo: \n", error);
        }
    });
});

router.put('/:id', (req,res) =>{
//curl -X PUT -H "Content-Type: application/json" -d '{"descricao": "Testando PUT", "status": "teste"}' http://localhost:3000/listaDeTarefas/id
    const id_site = parseInt(req.params.id);
    const atualizaProduto = req.body;

    fs.readFile('./data/produtos.json', 'utf8', (err,data) =>{
        if(err){
            res.status(500).send("Erro ao ler o arquivo.");
            console.error("Erro ao ler o arquivo: \n", err);
            return;
        }
        try{
            const dadosJSON = JSON.parse(data);
            const index = dadosJSON.findIndex(produto => produto.id === id);

            dadosJSON[index].descricao = atualizaProduto.descricao
            dadosJSON[index].preco = atualizaProduto.preco
            dadosJSON[index].nome = atualizaProduto.nome
            dadosJSON[index].marca = atualizaProduto.marca

            fs.writeFile('./data/produtos.json', JSON.stringify(dadosJSON, null, 2), 'utf8', (err) =>{
                if(err){
                    console.error("Erro ao gravar o arquivo: \n", err);
                }
                res.status(201).send("Produto atualizado com sucesso")
            });
        }
        catch (error){
            res.status(500).send("Erro ao converter o arquivo.");
            console.error("Erro ao converter o arquivo: \n", error);
        }
    });
});

router.delete('/:id', (req,res) =>{
//curl -X DELETE http://localhost:3000/listaDeTarefas/id
    const id_site = parseInt(req.params.id)
    fs.readFile('./data/produtos.json', 'utf8', (err,data) =>{
        if(err){
            res.status(500).send("Erro ao ler o arquivo.");
            console.error("Erro ao ler o arquivo: \n", err);
            return;
        }
        try{
            const dadosJSON = JSON.parse(data);
            const dadosIndex = dadosJSON.filter(produto => produto.id !== id_site)
            const jsonString = JSON.stringify(dadosIndex);
            fs.writeFile('./data/produtos.json', jsonString, 'utf8', (error) =>{
                if(error){
                    console.error("Erro ao ler o arquivo: \n", error)
                }
                res.status(200).send("Produto excluído com sucesso!!")
            });
        }
        catch (error){
            res.status(500).send("Erro ao converter o arquivo.");
            console.error("Erro ao converter o arquivo: \n", error);
        }
    });
});

//Rotas do carrinho
router.get('/carrinho', (req,res) =>{
    fs.readFile('./data/carrinho.json', 'utf8', (err, data) =>{
        if(err){
            res.status(500).send("Erro ao ler o arquivo");
            console.error("Erro ao ler o arquivo: \n", err);
            return;
        }
        try{
            const dadosJSON = JSON.parse(data);
            res.status(200).json(dadosJSON);
        }
        catch(error){
            res.status(500).send("Erro ao converter o arquivo.");
            console.error("Erro ao converter o arquivo: \n", error);
        }
    });
});

router.post('/carinho/adicionaproduto', (req,res) =>{
    fs.readFile('./data/carrinho.json', 'utf8', (err, data) =>{
        if(err){
            res.status(500).send("Erro ao ler o arquivo.");
            console.error("Erro ao ler o arquivo: \n", err);
            return;
        }
        try{
            const dadosJSON = JSON.parse(data);
            const produtoAdicionado = req.body;
            
            dadosJSON.push(produtoAdicionado);
            fs.writeFile('./data/carrinho.json', JSON.stringify(dadosJSON, null, 2), 'utf8', (err) =>{
                if(err){
                    console.error("Erro ao gravar o arquivo: \n", err);
                }
                res.status(201).send("Produto adicionado com sucesso!!");
            });
        }
        catch (error){
            res.status(500).send("Erro ao converter o arquivo.");
            console.error("Erro ao converter o arquivo: \n", error);
        }
    });
});

router.delete('/carrinho/:id', (req,res) =>{
    const id_site = parseInt(req.params.id)
    fs.readFile('./data/carrinho.json', 'utf8', (err,data) =>{
        if(err){
            res.status(500).send("Erro ao ler o arquivo.");
            console.error("Erro ao ler o arquivo: \n", err);
            return;
        }
        try{
            const dadosJSON = JSON.parse(data);
            const dadosIndex = dadosJSON.filter(produto => produto.id !== id_site)
            const jsonString = JSON.stringify(dadosIndex);
            fs.writeFile('./data/carrinho.json', jsonString, 'utf8', (error) =>{
                if(error){
                    console.error("Erro ao ler o arquivo: \n", error)
                }
                res.status(200).send("Produto excluído com sucesso!!")
            });
        }
        catch (error){
            res.status(500).send("Erro ao converter o arquivo.");
            console.error("Erro ao converter o arquivo: \n", error);
        }
    });
});

module.exports = router