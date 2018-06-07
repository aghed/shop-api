const express=require('express');
const routes=express.Router();
const UserController=require('../controllers/user');

routes.post('/signup',UserController.user_sign_up);

routes.post('/login',UserController.user_log_in);

routes.get('/allUsers',UserController.user_get_all);

module.exports=routes;