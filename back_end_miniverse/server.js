const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const port = 3000;
const login = require('./middlewares/logger');
const rotasProdutos = require('./rotas/rotas');

app.use(cors({
  origin: '*', 
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(login);
app.use(express.json());

app.use(express.static(path.join(__dirname, '../miniverse')));

app.use('/api', rotasProdutos);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../miniverse/html/index.html')); 
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
