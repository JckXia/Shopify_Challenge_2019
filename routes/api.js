const express=require('express');
const router=express.Router();
const Shop=require('../models/store');
var passwordHash=require('password-hash');
var MongoClient=require('mongodb').MongoClient;
const jwt=require('jsonwebtoken');
const passport=require('passport');
require('../config/passport')(passport);

// Routes to implement:
/*
CREATE: Create entire stores
READ:   Browse product lines
UPDATE  Add new products to the product line.
DELETE  Delete entire stores, delete products
*/

 


/*
 Format of request
   {
    "ShopName":"Microsoft"
    "OwnerName":Jack
    "OwnerPassword":14050079
 }
*/

// LOGIN
router.post('/shopify/login',(req,res)=>{
  Shop.findOne({ShopName:req.body.ShopName},function(err,store){
     if(err) throw err;
    if(store){

        if(req.body.OwnerName==store.OwnerName){
          if(passwordHash.verify(req.body.OwnerPassword,store.OwnerPassword)){
            const token=jwt.sign(JSON.stringify(store),'secret');
            res.send({
              success:1,
              token:'JWT '+token,
              Owner:{
                Shop:req.body.OwnerName,
                OwnerName:req.body.OwnerName
              }
            });
          }else{
            res.send({success:0,msg:"Incorrect Password!"});
          }
        }else{
       res.send({success:0,msg:"Incorrect Username"});
     }
    }else{
      res.send({success:0,msg:'Store not found!!'})
    }
  })
});


/*
{
 "Product":"Chicken"
}
*/
router.delete('/shopify/AdminRemove',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
   Shop.findOne({ShopName:req.user.ShopName},function(err,store){
      if(err) throw err;
       if(store){
          var ProductToRemove=req.body.Product;
            Shop.update({
              _id:store._id
            },{
              $pull:{"ProductLine":{product:ProductToRemove}}
            }).then(function(ok){

            });

          res.send({success:1,msg:"Successfully removed the product from catalogue"});
       }else{
         res.send({success:0,msg:"Store no longer exists!"});
       }
   });
});

/*
{
 "Product":"Chicken",
 "Price":"50",
 "Quantity":20
}
*/

router.post('/shopify/AdminAdd',passport.authenticate('jwt',{session:false}),(req,res,next)=>{


   //First, we must find the store in target.
   Shop.findOne({ShopName:req.user.ShopName},function(err,store){
      if(err) throw err;
      if(store){

        var index=-1;
       var ProductLine=store.ProductLine;
       for(var i=0;i<ProductLine.length;i++){
          if(ProductLine[i].product==req.body.Product){
             index=i;
             break;
          }
       }
       if(index==-1){
         Shop.update({
           _id : store._id
         },{
           $push: {"ProductLine": {product:req.body.Product,price:req.body.Price,quantity:req.body.Quantity}}
         }).then(function(ok){

         });
          res.send({success:1,msg:"Product added!"});
       }else{
         var targetProduct=ProductLine[index];
         Shop.update(
                   {_id:store._id},
                   {$set:{"ProductLine.$[i].quantity":req.body.Quantity}},
                   {arrayFilters: [{"i._id": targetProduct._id}]}
                 ).then(function(user){

                });

         res.send({success:1,msg:"Update succeeded!"});
       }

      }else{
        res.send('Store not found!');
      }
   });

});


//READ

router.post('/shopify/browse',(req,res)=>{
  Shop.findOne({ShopName:req.body.ShopName},function(err,store){
     if(err) throw err;
    if(store){
       res.send(store.ProductLine);
    }else{

      res.send('Store not found!!')
    }
  })
});

//CREATE
/*
{
 OwnerName:Jack,
 OwnerPassword:1235,
 ShopName:JackConv
 products:[]
}

This route creates entire stores, with basic information about its owner, the name of the store, etc
*/
router.post('/shopify/CreateStore',(req,res)=>{

    Shop.findOne({ShopName:req.body.ShopName},function(err,store){
       if(err) throw err;
        if(store){
          res.send({success:0,msg:"Shop already exists"})
        }else{
        req.body.OwnerPassword=passwordHash.generate(req.body.OwnerPassword);
         Shop.create(req.body).then(function(ninja){
           res.json({success:0,msg:"Successfully Created shop!"});
         });
        }
    })
     });


// UPDATE
//We need a purchase/Line order route.
//The request made to this route looks as follows:
/*
{
 "ShopName":JackConv
  "Product":"Milk"
  "Quantity":20
}

*/
router.post('/shopify/purchase',(req,res)=>{
    Shop.findOne({ShopName:req.body.ShopName},function(err,store){
       if(err) throw err;
      if(store){
           var product=req.body.Product;
          var productLine=store.ProductLine;

              if(productLine.length==0){
               res.send({success:0,msg:"There aren't any products atm in the store, check later!"})
              return;
            }
            var index=-1;
             for(var i=0;i<productLine.length;i++){
                if(productLine[i].product==product){

                  index=i;
                  break;
                }
             }
             if(index==-1){
               res.send({success:0,msg:"Product doesn't exist! Sorry!"});
               return;
             }
             var targetProduct=productLine[index];

            var inventoryQuantity=targetProduct.quantity;
            var intentPurchasedQuantity=req.body.Quantity;



             if(intentPurchasedQuantity>inventoryQuantity||intentPurchasedQuantity<0||inventoryQuantity<0){
               res.send({success:0,msg:"Invalid quantity!"});
               return;
             }
             targetProduct.quantity=inventoryQuantity-intentPurchasedQuantity;


      Shop.update(
                {_id:store._id},
                {$set:{"ProductLine.$[i].quantity":targetProduct.quantity}},
                {arrayFilters: [{"i._id": targetProduct._id}]}
              ).then(function(user){

             });

              var Order={
                "product":req.body.Product,
                "price":targetProduct.price,
                "quantity":req.body.Quantity
              }
              store.order.push(Order);


               Shop.update({
                 _id : store._id
               },{
                 $push: {"order": {product:req.body.Product,price:targetProduct.price,quantity:req.body.Quantity}}
               }).then(function(ok){

               });
    res.send({success:1,msg:"Succcessfully made purchase"});
      }else{
        res.send({success:0,msg:"Shop doesnt exist"});
      }
    });
});


module.exports=router;
