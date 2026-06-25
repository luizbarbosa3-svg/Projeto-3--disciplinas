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
    const result = await db.query('SELECT * FROM pagamento');

    //Responde com os dados da consulta
    res.status(200).json(result.rows);
});

//------------------------------------------------------------------
//ROTA POST
routes.post('/', async (req, res) => {
    //Extrair os valores recebidos por parâmetros
    const {
        id_al,
        id_pla,
        valor,
        condicao_pagamento,
        data_pagamento,
        hora_pagamento
    } = req.body;

    if (
        !id_al ||
        !id_pla ||
        !valor ||
        !condicao_pagamento ||
        !data_pagamento ||
        !hora_pagamento
    ) {
        return res.status(400).json({
            mensagem: 'Todos os campos são obrigatórios.'
        });
    }

    //Constrói a query inserção SQL
    const sql = `
        INSERT INTO pagamento (
            id_al,
            id_pla,
            valor,
            condicao_pagamento,
            data_pagamento,
            hora_pagamento
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;

    //Valores qeu serão usado na inserção SQL
    const valores = [
        id_al,
        id_pla,
        valor,
        condicao_pagamento,
        data_pagamento,
        hora_pagamento
    ];

    //Executa a operação no banco de dados
    const result = await db.query(sql, valores);

    //Retorna para o cliente os valores inseridos no banco
    res.status(201).json(result.rows[0]);
});

//--------------------------------------------------------------------
//Rota PUT

routes.put('/:id_pag', async (req, res) => {
    //Obtém o id informado pelo usuário na URL
    const { id_pag } = req.params;

    //Verifica se o id foi informado
    if (!id_pag) {
        return res.status(400).json({
            mensagem: 'id do pagamento é obrigatório'
        });
    }

    //Extrair as informações do corpo da requisição
    const {
        id_al,
        id_pla,
        valor,
        condicao_pagamento,
        data_pagamento,
        hora_pagamento
    } = req.body;

    //Verifica se todos os campos estãos preenchidos
    if (
        !id_al ||
        !id_pla ||
        !valor ||
        !condicao_pagamento ||
        !data_pagamento ||
        !hora_pagamento
    ) {
        return res.status(400).json({
            mensagem: 'Todos os campos são Obrigatórios.'
        });
    }

    //criação da query SQL de alteração no banco de dados
    const sql = `
        UPDATE pagamento
        SET id_al = $1,
            id_pla = $2,
            valor = $3,
            condicao_pagamento = $4,
            data_pagamento = $5,
            hora_pagamento = $6
        WHERE id_pag = $7
        RETURNING *
    `;

    //valores usado na query
    const valores = [
        id_al,
        id_pla,
        valor,
        condicao_pagamento,
        data_pagamento,
        hora_pagamento,
        id_pag
    ];

    //Executa a atualização no banco de dados
    const result = await db.query(sql, valores);

    //Caso não tenha o id informado no banco
    //informa que o pagamento não foi encontrado
    if (result.rows.length === 0) {
        return res.status(404).json({
            mensagem: 'Pagamento não encontrado.'
        });
    }

    res.status(200).json(result.rows[0]);
});

//--------------------------------------------------------------------------
//ROTA DELETE
routes.delete('/:id_pag', async (req, res) => {
    //obtém o id informado pelo usuário
    const { id_pag } = req.params;

    //Verifica se id existe
    if (!id_pag) {
        return res.status(400).json({
            mensagem: 'O id do pagamento é obrigatório'
        });
    }

    //Constrói a query SQL
    const sql = `
        DELETE FROM pagamento
        WHERE id_pag = $1
        RETURNING *
    `;

    //valores que serão usados na query
    const valores = [id_pag];

    //Apagar os dados no banco de dados
    const result = await db.query(sql, valores);

    //Verifica se o id existe
    //ou se ele já não foi deletado
    if (result.rows.length === 0) {
        return res.status(404).json({
            mensagem: 'Pagamento não encontrado.'
        });
    }

    //Quando a requisação for realizada
    res.status(200).json({
        mensagem: `Pagamento com ID ${id_pag} foi excluído com sucesso.`
    });
});

module.exports = routes;