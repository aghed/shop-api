const express=require('express');
const routes=express.Router();

const checkAuth=require('../middelware/check-auth');

const OrdersController=require('../controllers/orders');

routes.get('/',OrdersController.orders_get_all);

routes.post('/',checkAuth,OrdersController.orders_create_new);

routes.delete('/:orderId',checkAuth,OrdersController.orders_delete);

routes.get('/:orderId',OrdersController.orders_find_by_id);

routes.patch('/:orderId',checkAuth,OrdersController.orders_update);
module.exports=routes;