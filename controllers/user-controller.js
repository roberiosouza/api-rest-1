const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postCreated = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {return console.error(error); res.status(500).send({error : error});}

        conn.query(
            `select * from user where email = ?`,
            [req.body.email],
            (error, result, field) => {
                if (error) {return console.error(error); res.status(500).send({error : error});}
                if(result.length > 0) {
                    return res.status(401).send(
                        {
                            mensagem : 'Já existe um usuário cadastrado com esse email.'
                        }
                    );
                }
            }
        )

        bcrypt.hash(req.body.password.toString(), 3, (errorBcrypt, hash) => {
            if (errorBcrypt) {return console.error(errorBcrypt); res.status(500).send({error : errorBcrypt});}
            conn.query(
                `insert into user (email, password) values (?,?)`, 
                [req.body.email, hash],
                (error, result, field) => {
                    conn.release();
                    if(error) {return console.error(error); res.status(500).send({error : error});}
                    response = {
                        mensagem : 'Usuário criado.',
                        usuario : {
                            id : result.insertId,
                            email : req.body.email
                        }
                    }
                    return res.status(201).send(response);
                }
            )
        });
    });
};

exports.postLogin = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { return console.error(error); res.status(500).send({error : error}); }

        const query = `select * from user where email = ?`;
        conn.query(query, [req.body.email],
            (error, result, field) => {
                conn.release();
                if (error) { return console.error(error); res.status(500).send({error : error}); }

                if (result.length < 1) {
                    return res.status(401).send({mensagem: 'Falha na autenticação.'});
                }

                bcrypt.compare(req.body.password.toString(), result[0].password, (error, results) => {
                    if (error) { return console.error(error); res.status(401).send({mensagem : 'Falha na autenticação.'}); }

                    if (results) {

                        const token = jwt.sign(
                            {
                                id_user : result[0].id,
                                email : result[0].email
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn : "1h"
                            }
                        );

                        return res.status(200).send({mensagem:'Autenticado com sucesso.', token : token});
                    }

                    return res.status(401).send({mensagem: 'Falha na autenticação.'});
                });

            });
    })

};