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

                return res.status(200).send({response: result});
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
          
                return res.status(201).send({
                    mensagem : 'Produto inserido com sucesso',
                    id_product : result.insertId
                });
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

                return res.status(202).send({
                    mensagem : 'Produto alterado com sucesso.'
                });
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
                return res.status(202).send({
                    mensagem : 'Produto excluido com sucesso.'
                });
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

                return res.status(200).send({response : result});
            }

        )
    });
});

module.exports = router;