const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
    try{
        const decoded=jwt.verify(req.body.token,process.env.JWT_KEY,{
            //ignoreExpiration:true,
        });
        req.userData=decoded;
        next();
    }catch(err){
        //unauthoraized response
        if(err.name=="TokenExpiredError")
            return res.status(401).json({
                message:'expired'
            });

        else return res.status(500).json({
            message:'Auth Failed',
            error:error
        })
    }   
    
};