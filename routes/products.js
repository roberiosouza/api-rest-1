const express = require('express');
const router = express.Router();
const Login = require('../middleware/login');
const multer = require('multer');
const storange = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const upload = multer( {storage: storange} );

const productController = require('../controllers/product-controller');

//Retorna os produtos
router.get('/', productController.getProduct);

//Retorna um produto
router.get('/:id', productController.getOneProduct);

//Salva um produto
router.post('/', Login, upload.single('product_image'), productController.postProduct);

//Atualizar um produto
router.patch('/', Login, productController.patchProduct);

//Excluir um produto
router.delete('/', Login, productController.deleteProduct);

module.exports = router;