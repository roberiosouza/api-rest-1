const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Retorna os pedidos
router.get('/', (req, res, next) =>{

    mysql.getConnection((error, conn) => {
        if(error) {return console.error(error); res.status(500).send({error : error});}

        conn.query(
            `
                select orders.id, orders.qtd,
                products.id as products_id, products.name, products.price  
                from orders
                inner join products on (products.id=orders.products_id)
            `,
            (error, result, field) => {
                conn.release();
                if(error) { return console.error(error); res.status(500).send({ error : error }); }

                const response = {
                    request : {
                        type : 'GET',
                        description : 'Retorna todos os pedidos',
                        url : 'http://localhost:3000/orders/'
                    },

                    orders : result.map(order => {
                        return {
                            id : order.id,
                            qtd : order.qtd,
                            products : {
                                product_id : order.products_id,
                                name : order.name,
                                price : order.price
                            }                          
                        }
                    })                   
                }
                return res.status(200).send({ response });
            }
        )
    });

});

//Salva um pedido
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) {return console.error(error); res.status(500).send({error : error});}

        conn.query(
            'insert into orders (products_id, qtd) values (?, ?)',
            [req.body.products_id, req.body.qtd],
            (error, result, field) => {
                conn.release();
                if (error) {return console.error(error); res.status(500).send({ error : error });}

                const response = {
                    mensagem : 'Pedido criado com sucesso.',
                    orderCreated : {
                        id : result.id,
                        products_id : req.body.products_id,
                        qtd : req.body.qtd,
                        request : {
                            type : 'POST',
                            description : 'Insere um novo pedido.',
                            url : 'http://localhost:3000/orders/'
                        }
                    }
                }

                return res.status(201).send({ response });
            }
        )

        
    });
});

//Atualizar um pedido
router.patch('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) {return console.error(error); res.status(500).send({ error : error });}

        conn.query(
            'update orders set products_id=?, qtd=? where id = ?;',
            [req.body.products_id, req.body.qtd, req.body.id],
            (error, result, field) => {
                conn.release();
                if (error) {return console.error(error); res.status(500).send({error : error});}

                const response = {
                    mensagem : 'Pedido atualizado com sucesso.',
                    order : {
                        id : req.body.id,
                        products_id : req.body.products_id,
                        qtd : req.body.qtd,

                        request : {
                            type : 'PATCH',
                            description : 'Atualiza um pedido específico.',
                            url : 'http://localhost:3000/orders/' + req.body.id
                        }
                    }
                }
                return res.status(202).send({ response });
            }
        )
    });

 

});

//Excluir um pedido
router.delete('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) {return console.error(error); res.status(500).send({error : error});}
        conn.query(
            'delete from orders where id=?;',
            [req.body.id],
            (error, result, field) => {
                conn.release();

                if(error) {return console.error(error); res.status(500).send({error : error});}

                const response = {
                    mensagem : 'Pedido deletado com sucesso.',
                    request : {
                        type : 'DELETE',
                        description : 'Exclui um pedido específico.',
                        url : 'http://localhost:3000/orders/' + req.body.id
                    }
                }

                return res.status(201).send({ response });
            
            }
        )
    });
});

//Retorna um pedido
router.get('/:id', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return console.error(error); res.status(500).send({ error : error }); }
        conn.query(
            'select * from orders where id = ?;',
            [req.params.id],
            (error, result, field) => {
                conn.release();

                if(error) { return console.error(error); res.status(500).send({ error : error }); }
                const response = {
                    order : {
                        id : result[0].id,
                        products_id : result[0].products_id,
                        qtd : result[0].qtd,
                        request : {
                            type : 'GET',
                            description : 'Seleciona um produto específico',
                            url : 'http://localhost:3000/orders/' + result[0].id
                        }
                    }
                }

                res.status(200).send({ response });
            }
        )
    });

});

module.exports = router;