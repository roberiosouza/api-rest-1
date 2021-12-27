const express = require('express');
const router = express.Router();

//Retorna os produtos
router.get('/', (req, res, next) =>{

    res.status(200).send({
        mensagem : 'GET da rota de produtos',
    });

});

//Salva um produto
router.post('/', (req, res, next) => {

    res.status(201).send({
        mensagem : 'POST da rota de produtos',
    });

});

//Atualizar um produto
router.patch('/', (req, res, next) => {

    res.status(201).send({
        mensagem : 'PATCH da rota de produtos',
    });

});

//Excluir um produto
router.delete('/', (req, res, next) => {

    res.status(201).send({
        mensagem : 'DELETE da rota de produtos',
    });

});

//Retorna um produto
router.get('/:id', (req, res, next) => {

    const id = req.params.id;

    res.status(200).send({
        mensagem : 'Rota com parametro',
        id : id,
    });

});

module.exports = router;