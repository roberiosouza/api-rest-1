const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order-controller');

//Retorna os pedidos
router.get('/', orderController.getOrders);

//Salva um pedido
router.post('/', orderController.postOrders);

//Retorna um pedido
router.get('/:id', orderController.getOneOrder);

//Atualizar um pedido
router.patch('/', orderController.patchOrders);

//Excluir um pedido
router.delete('/', orderController.deleteOrders);

module.exports = router;