const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

router.post('/created', (req, res, next) => {
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
});

module.exports = router;