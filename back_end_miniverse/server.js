const express = require('express')
const app = express()
const port = 3000
const login = require('./middlewares/logger')
const rotasProdutos = require('./rotas/rotas')

app.use(login)
app.use(express.json())

app.use('/listaprodutos', rotasProdutos)

app.get('/', (req,res) =>{
    res.send("Página inicial do site Miniverse");
})

app.listen(port, ()=>{
    console.log(`Servidor rodando em http://localhost:${port}`)
})