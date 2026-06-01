//importar os módulos
//express
const express = require('express');

//Criar um roteador do express para definir as rotas separadamente
//do app principal
const routes = express.Router();

//importar a conexão com o banco de dados PostgreSQL
const db = require('../db/connect');

//--------------------------------------------------------------------
//ROTA GET
routes.get('/', async (req, res) => {
    //Realizar a consulta no banco de dados usando SQL.
    const result = await db.query('SELECT * FROM aluno');

    //Responde com os dados da consulta
    res.status(200).json(result.rows);
});

//------------------------------------------------------------------
//ROTA POST
routes.post('/', async (req, res) => {

    //Extrair os valores recebidos por parâmetros
    const {nome, telefone, condicao_aluno} = req.body;

    if(!nome || !telefone || !condicao_aluno){
        return res.status(400).json({mensagem: 'Todos os campos são obrigatórios.'});
    }

    //Constrói a query inserção SQL
    const sql = `
        INSERT INTO aluno (nome, telefone, condicao_aluno)
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    //Valores que serão usados na inserção SQL
    const valores = [nome, telefone, condicao_aluno];

    //Executa a operação no banco de dados
    const result = await db.query(sql, valores);

    //Retorna para o cliente os valores inseridos no banco
    res.status(201).json(result.rows[0]);
});

//--------------------------------------------------------------------
//Rota PUT

routes.put('/:id_al', async (req, res) => {

    //Obtém o id informado pelo usuário na URL
    const {id_al} = req.params;

    //Verifica se o id foi informado
    if(!id_al){
        return res.status(400).json({mensagem: 'id do aluno é obrigatório'});
    }

    //Extrair as informações do corpo da requisição
    const {nome, telefone, condicao_aluno} = req.body;

    //Verifica se todos os campos estão preenchidos
    if(!nome || !telefone || !condicao_aluno){
        return res.status(400).json({mensagem: 'Todos os campos são Obrigatórios.'});
    }

    //criação da query SQL de alteração no banco de dados
    const sql = `
        UPDATE aluno
        SET nome = $1 , telefone = $2 , condicao_aluno = $3
        WHERE id_al = $4
        RETURNING *
    `;

    //valores usado na query
    const valores = [nome, telefone, condicao_aluno, id_al];

    //Executa a atualização no banco de dados
    const result = await db.query(sql, valores);

    //Caso não tenha o id informado no banco
    //informa que o aluno não foi encontrado
    if(result.rows.length === 0){
        return res.status(404).json({mensagem: 'Aluno não encontrado.'});
    }

    res.status(200).json(result.rows[0]);
});

//--------------------------------------------------------------------------
//ROTA DELETE
routes.delete('/:id_al', async (req, res) => {

    //obtém o id informado pelo usuário
    const {id_al} = req.params;

    //Verifica se id existe
    if(!id_al){
        return res.status(400).json({mensagem: 'O id do aluno é obrigatório'});
    }

    //Constrói a query SQL
    const sql = `
        DELETE FROM aluno
        WHERE id_al = $1
        RETURNING *
    `;

    //valores que serão usados na query
    const valores = [id_al];

    //Apagar os dados no banco de dados
    const result = await db.query(sql, valores);

    //Verifica se o id existe
    //ou se ele já não foi deletado
    if(result.rows.length === 0) {
        return res.status(404).json({mensagem: 'Aluno não encontrado.'});
    }

    //Quando a requisição for realizada
    res.status(200).json({mensagem: `Aluno com ID ${id_al} foi excluído com sucesso.`});
});

module.exports = routes;