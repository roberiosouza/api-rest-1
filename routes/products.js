const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna os produtos
router.get('/', (req, res, next) =>{

    mysql.getConnection((error, conn) => {
        if(error){ return console.error(error); res.status(500).send({ error: error });}

        conn.query(
            'select * from products',
            (error, result, field) => {
                conn.release();
                if (error) { return console.error(error); res.status(500).send({ error: error }) } 

                const response = {
                    quantity : result.length,
                    products : result.map(prod => {
                        return {
                            id : prod.id,
                            name : prod.name,
                            price : prod.price,
                            request : {
                                type : 'GET',
                                description : 'Retorna todos os produtos',
                                url : 'http://localhost:3000/products/' + prod.id   
                            }
                        }
                    })
                }

                return res.status(200).send({response});
            }
        )
    });

});

//Salva um produto
router.post('/', (req, res, next) => {


    mysql.getConnection((error, conn) => {
        if (error) { return console.error(error); res.status(500).send({ error: error }) }
        conn.query(
            'insert into products (name, price) values (?,?)',
            [req.body.name, req.body.price],
            (error, result, field) => {
                conn.release();

                if (error) { return console.error(error); res.status(500).send({ error: error }) }
                
                const response = {
                    mensagem : 'Produto inserido com sucesso',
                    productCreated : {
                        id : result.id,
                        name : req.body.name,
                        price : req.body.price,
                        request : {
                            type : 'POST',
                            description : 'Insere um produto',
                            url : 'http://localhost:3000/products/'
                        }
                    }
                }

                return res.status(201).send({ response });
            }
        )
    });


});

//Atualizar um produto
router.patch('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) { return console.error(error); res.status(500).send({ error : error }); }
        conn.query(
            'update products set name=?, price=? where id=?;',
            [req.body.name, req.body.price, req.body.id],

            (error, result, field) => {
                conn.release();

                if(error) { return console.error(error); res.status(500).send({ error : error }); }

                const response = {
                    mensagem : 'Produto alterado com sucesso.',
                    productAltered : {
                        id : req.body.id,
                        name : req.body.name,
                        price : req.body.price,
                        request : {
                            type : 'PATCH',
                            description : 'Altera os valores de um produto específico',
                            url : 'http://localhost:3000/products/' + req.body.id
                        }
                    }
                }

                return res.status(202).send({ response });
            }
        )
    });

});

//Excluir um produto
router.delete('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) { return console.error(error); res.status(500).send({ error : error }); }
        conn.query(
            'delete from products where id = ?;',
            [req.body.id],

            (error, result, field) => {
                conn.release();

                if(error){ return console.error(error); res.status(500).send({ error : error }); }

                const response = {
                    mensagem : 'Produto excluido com sucesso.',
                    request : {
                        type : 'DELETE',
                        description : 'Exclui um produto específico',
                        url : 'http://localhost:3000/products/' + req.body.id
                    }
                }
                return res.status(202).send({ response });
            }

        )

    });

});

//Retorna um produto
router.get('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error){ return console.error(error); res.status(500).send({error : error}); }
        conn.query(
            'select * from products where id = ?;',
            [req.params.id],
            (error, result, field)=>{
                conn.release();

                if(error){ return console.error(error); res.status(500).send({error : error});}

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem : 'Produto não encontrado com esse ID'
                    });
                }

                const response = {
                    product : {
                        id : result[0].id,
                        name : result[0].name,
                        price : result[0].price,
                        request : {
                            type : 'GET',
                            description : 'Retorna um produto específico',
                            url : 'http://localhost:3000/products/' + result[0].id
                        }
                    }
             }

                return res.status(200).send({response});
            }

        )
    });
});

module.exports = router;