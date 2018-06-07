const mongoose=require('mongoose');
const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const constants=require('../constants');

exports.user_sign_up=(req,res,next)=>{
    console.log(req.body.email);
    User.find({email:req.body.email}).exec()
    .then((user)=>{
        if(user.length>=1)
            res.status(409).json({
                message:'email_used'
            })
            else{
                bcrypt.hash(req.body.password,10,(err,hash)=>{
                    if(err){
                        console.log(err);
                        res.status(500).json({error:err,user:{email:req.body.email,pass:req.body.password}});
                    }else{
                        const user=new User({
                            _id:mongoose.Types.ObjectId(),
                            email:req.body.email,
                            password:hash
                        });
                        user.save().then((results)=>{
                              res.status(200).json({
                                  message:constants.success,
                                  user:user
                              })  
                        }).catch(err=>{
                            console.log(err);
                            res.status(500).json({
                                error:err
                            })
                        })
                    }
                })
            }
    });
   
};

exports.user_log_in=(req,res,next)=>{
    User.find({email:req.body.email}).exec()
    .then(users=>{
        if(users.length<1){
            res.status(401).json({
                message:'Auth Failed'
            });
        }
         bcrypt.compare(req.body.password,users[0].password,(err,same)=>{
            if(err){
                return res.status(401).json({
                    message:'Auth Failed'
                });
            }

            if(same){
                //used const to make it synchronize
                const token=jwt.sign({
                    email:users[0].email,
                    id:users[0]._id
                }, process.env.JWT_KEY,
                {
                    expiresIn:"1h"
                },
            );
                return res.status(200).json({
                    message:constants.success,
                    token:token
                })
            }
            //in case we reach it here

            res.status(401).json({
                message:'Auth Failed'
            });
         });
    })
}

exports.user_get_all=(req,res,next)=>{
    users=User.find().exec().then(results=>
        res.status(200).json({
            users:results
        }).catch(err=>{
            res.status(500).json({error:err})
        })
    );
}