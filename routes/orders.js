const express = require('express');
const router = express.Router();


//Retorna os pedidos
router.get('/', (req, res, next) =>{

    res.status(200).send({
        mensagem : 'GET da rota de pedidos',
    });

});

//Salva um pedido
router.post('/', (req, res, next) => {

    res.status(201).send({
        mensagem : 'POST da rota de pedido',
    });

});

//Atualizar um pedido
router.patch('/', (req, res, next) => {

    res.status(201).send({
        mensagem : 'PATCH da rota de pedidos',
    });

});

//Excluir um pedido
router.delete('/', (req, res, next) => {

    res.status(201).send({
        mensagem : 'DELETE da rota de pedido',
    });

});

//Retorna um pedido
router.get('/:id', (req, res, next) => {

    const id = req.params.id;

    res.status(200).send({
        mensagem : 'Rota com parametro',
        id : id,
    });

});

module.exports = router;