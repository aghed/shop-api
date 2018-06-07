const mongoose=require('mongoose');
//define the schema
const productSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    price:{type:Number,required:true},
    productImage:{type:String,required:true}
});

module.exports=mongoose.model('Product',productSchema);