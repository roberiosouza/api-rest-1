const mysql = require('../mysql').pool;

exports.getProduct = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return console.error(error); res.status(500).send({error : error}); }

        conn.query(`select * from products`,
        (error, result, field) => {
            conn.release();
            if (error) { return console.error(error); res.status(500).send({error : error}); }
        
            const response = {
                quantity : result.length,
                products : result.map(prod => {
                    return {
                        id : prod.id,
                        name : prod.name,
                        price : prod.price,
                        product_image : prod.produc_image,
                        request : {
                            type : 'GET',
                            description : 'Retorna todos os produtos',
                            url : 'localhost:3000/products' + prod.id
                        }
                    }
                }),
            }

            return res.status(200).send({response});
        }) 
    });

};

exports.postProduct = (req, res, next) => {
    
    console.log(req.file);

    mysql.getConnection((error, conn) => {

        if (error) { return console.error(error); res.status(500).send({error : error}); }
        conn.query(
            `insert into products (name, price, product_image)
            values (?,?,?);
            `, [req.body.name, req.body.price, req.file.path],
            
            (error, result, field) => {
                conn.release();
                if (error) { return console.error(error); res.status(500).send({error : error}); }

                const response = {
                    mensage : 'Produto inserido com sucesso.',
                    productCreated : {
                        id : result.insertId,
                        name : req.body.name,
                        price : req.body.price,
                        product_image : req.file.path,
                        request : {
                            type : 'POST',
                            description : 'Insere um novo produto.',
                            url : 'localhost:3000/products'
                        } 
                    }
                }

                return res.status(201).send({response});
            }); 
    });
};

exports.getOneProduct = (req, res, next) => {

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
                        mensagem : 'Produto n??o encontrado com esse ID'
                    });
                }

                const response = {
                    product : {
                        id : result[0].id,
                        name : result[0].name,
                        price : result[0].price,
                        product_image : result[0].product_image,
                        request : {
                            type : 'GET',
                            description : 'Retorna um produto espec??fico',
                            url : 'http://localhost:3000/products/' + result[0].id
                        }
                    }
             }

                return res.status(200).send({response});
            }

        )
    });
};

exports.patchProduct = (req, res, next) => {

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
                            description : 'Altera os valores de um produto espec??fico',
                            url : 'http://localhost:3000/products/' + req.body.id
                        }
                    }
                }

                return res.status(202).send({ response });
            }
        )
    });

};

exports.deleteProduct = (req, res, next) => {

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
                        description : 'Exclui um produto espec??fico',
                        url : 'http://localhost:3000/products/' + req.body.id
                    }
                }
                return res.status(202).send({ response });
            }

        )

    });

};