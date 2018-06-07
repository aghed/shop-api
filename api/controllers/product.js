const mongoose=require('mongoose');
const Product=require('../models/product');
const multer=require('multer');
const checkAuth=require('../middelware/check-auth');


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString().replace(/:/g, '-')+ file.originalname)
    }
});

const fileFilter=(req,file,cb)=>
{
    //reject a file 
    //cb(null,false)
    if(file.mimetype==='image/jpeg'|| file.mimetype==='image/png')
    {
        cb(null,true);
    }
    else cb(null,false);
};
const upload=multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*5
    },
    fileFilter:fileFilter    
});

exports.products_get_all=(req,res,next)=>{
    Product.find().exec()
    .then(docs=>{
        console.log(docs);
        if(docs.length >0)
            res.status(200).json(docs);
        else{
            res.status(200).json({message:'no entries found'});
        }
    });
};

exports.product_create_new=upload.single('productImage'),checkAuth,(req,res,next)=>{
    const product=new Product({
     _id:mongoose.Types.ObjectId(),
     name:req.body.name,
     price:req.body.price,
     productImage:req.file.path
    });
    product.save().then(res=>{
        console.log(res)
    }).catch(err=>{
        console.log(err)
    });
     res.status(200).json({
         message:'handling post requests',
         createdProduct:product
     })
 };

 exports.product_get_by_id=(req,res,next)=>{
    const id=req.params.productId;
    console.log(id);
    Product.findById(id).exec().then(
        doc=>{
            console.log(doc);
            res.status(200).json(doc);
        }) 
};
exports.product_update=(req,res,next)=>{
   const id=req.params.productId;
   
   Product.update({_id:id},{$set:{name:req.body.name,price:req.body.price}})
   .exec()
   .then(results=>{
        res.status(200).json({
            message:'updated successfully'
        })
   }).catch(err=>{
       res.status(500).json({error:err});
   })
   ;
};

exports.product_delete=(req,res,next)=>{
    const id=req.params.productId;
    Product.remove({_id:id}).exec()
    .then(res=>{
        res.status(200).json(result);
    })
    .catch(err=>
    {
        console.log(err);
        res.status(500).json({error:err});
    });
};