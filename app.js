/**
 * Servidor back-end utilizando o módulo Express para criar uma API REST
 * e realizar as operações de CRUD no banco de dados PostgreSQL 
 * (GET,POST,PUT,DELETE).
 */

//Importação dos módulos utilizados no projeto
//Express
const express = require('express');
//Criar a instância do aplicativo express
const app = express();
//Path
const path = require('path');
//Cors
cors = require('cors');
app.use(cors());
//Dotenv
//Carregar as variáveis de ambiente definidas no arquivo .env
require('dotenv').config();

//Configuração do IP e da PORTA do servidor
const hostname = process.env.APP_HOST;
const port = process.env.APP_PORT;

//importando as informações das rotas aluno
const alunoRotas = require('./routes/aluno');
//importando as informações das rotas pagamento
const pagamentoRotas = require('./routes/pagamento');
//importando as informações das rotas pagamento
const planoRotas = require('./routes/plano');

//Definição de rota raiz "/"
//Configuração do servidor
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

//Indica que o servidor irá responder com dados Json
app.use(express.json());

// Servir arquivos estáticos (HTML/CSS/JS) da pasta pages
app.use(express.static(path.join(__dirname, 'pages')));

//Expor as rotas do servidor
app.use('/aluno', alunoRotas);
app.use('/pagamento', pagamentoRotas);
app.use('/plano', planoRotas)

//Inicio do servidor
app.listen(port, hostname, async () =>{
    console.log(`Servidor rodando em http://${hostname}:${port}/`);
});