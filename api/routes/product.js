const express=require('express');
const routes=express.Router();
const ProductController=require('../controllers/product');
const checkAuth=require('../middelware/check-auth');

//this will hadle get requests
routes.get('/',ProductController.products_get_all);

routes.post('/',checkAuth,ProductController.product_create_new);

routes.get('/:productId',ProductController.product_get_by_id);

routes.patch('/:productId',checkAuth,ProductController.product_update);

routes.delete('/:productId',checkAuth,ProductController.product_delete);

module.exports=routes;  