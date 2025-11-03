const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const login = require('./middlewares/logger')
const rotasProdutos = require('./rotas/rotas')

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}))

app.use(login)
app.use(express.json())

app.use('/', rotasProdutos)

app.get('/', (req,res) =>{
    res.send("Página inicial do site Miniverse");
})

app.listen(port, ()=>{
    console.log(`Servidor rodando em http://localhost:${port}`)
})