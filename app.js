const express=require("express");
const productRoutes=require('./api/routes/product')
const orderRoutes=require('./api/routes/orders');
const userRoutes=require('./api/routes/user');
const morgan=require('morgan');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const checkAuth=require('./api/middelware/check-auth');

mongoose.connect('mongodb://localhost:27017').catch(err=>{
    console.log(err)
});
//this is used to handle monitoring
app.use(morgan('dev'));
//this is the body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Content-Type");
    res.header( "Authorization,Accept,Content-Type,X-Requested-With,Origin");    
    if(req.method==='OPTIONS'){
        res.header("Access-Control-Allow-Methods","PUT,POST,PATCH,DELETE,GET");
        //just to provide answers when the api is asked about options     
        return res.status(200).json({
        })    
    }
    //procede with the next function
    next();
}) ;

//use is for middleware
//here it is a filter to match routes starting with products
//it will then pass it to 
//product router and this way evry thing after /products
//the second arg is a handler   
app.use('/products',productRoutes);
//here through the /orders handler
app.use('/orders',orderRoutes);

app.use('/users',userRoutes);

app.use('/authCheck',checkAuth,(req,res,next)=>{
    res.status(200).json({message:'success'});
});
//in case it bases the past tow middlewares
app.use((req,res,next)=>
{
    const error=new Error('not found');
    error.status=404;
    next(error); 
})
//this middle wrae will be called when pass the previous middleware 
app.use((error,req,res,next)=>{
    res.status(error.status ||500);
    res.json({
        error:{
            message:error.message
        }
    });
})
module.exports=app;