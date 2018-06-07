
const mongoose=require('mongoose');
const Order=require('../models/orders');
const Product=require('../models/product');
exports.orders_get_all=(req,res,next)=>{
    Order.find()
    .select('product quantity _id')
    .populate('product','name price')
    .exec()
    .then(results=>res.status(200).json(results));
};
exports.orders_create_new=(req,res,next)=>{
    console.log(req.body);
    Product.findById(req.body.product)
    .then(product=>
    {
        if(!product)
        res.status(500).json({
            message:'product not found'
        }) ;

        const order=new Order({
            _id:mongoose.Types.ObjectId(),
            product:req.body.product,
            quantity:req.body.quantity
        });
        order.save().then(results=>{
                console.log(res);
                res.status(200).json(results);
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({error:err})
            });
    })
    .catch(err=>
    {
        res.status(500).json({
            message:'no such product!!'
        })
    });
}

exports.orders_find_by_id=(req,res,next)=>{
    Order.findById(req.body.oredrId)
    .exec()
    .then(results=>{
        res.status(200).json({message:'fetched success',product:results});
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
};

exports.orders_delete = (req,res,next)=>{
    res.status(200).json({  
        message:'handling delete requests' 
    })
}

exports.orders_update=(req,res,next)=>{
    const id=req.body.orderId;
    Order.update({_id:id},{$set:{product:req.body.product,quantity:req.body.quantity}})
    .exec()
    .then(results=>{
        res.status(200).json({message:'updated success'})
    }).catch(err=>{
        res.status(500).json({error:err});
    })
}