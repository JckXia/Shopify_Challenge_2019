const express=require('express');
const router=express.Router();
const Shop=require('../models/store');
var MongoClient=require('mongodb').MongoClient;


// Routes to implement:
/*
CREATE: Create entire stores
READ:   Browse product lines
UPDATE  Add new products to the product line.
DELETE  Delete entire stores, delete products
*/

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
   console.log(req.body);
    Shop.findOne({ShopName:req.body.ShopName},function(err,store){
       if(err) throw err;
        if(store){
          res.send({success:0,msg:"Shop already exists"})
        }else{
         Shop.create(req.body).then(function(ninja){
           res.json(ninja);
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
NOTE:
For this part, we need to make three checks:
IF shopname doesnt exist-> res.send err
IF product doesn't exist -> res.send err
IF quantity < 0 || quantity > quantity in stock -> Invalid quantity
Else, find the product, the associated price and return the result
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
           //We shall make a minor update here

      Shop.update(
                {_id:store._id},
                {$set:{"ProductLine.$[i].quantity":targetProduct.quantity}},
                {arrayFilters: [{"i._id": targetProduct._id}]}
              ).then(function(user){
             console.log(user);
             });

              var Order={
                "product":req.body.Product,
                "price":targetProduct.price,
                "quantity":req.body.Quantity
              }
              store.order.push(Order);
               console.log(store);

               Shop.update({
                 _id : store._id
               },{
                 $push: {"order": {product:req.body.Product,price:targetProduct.price,quantity:req.body.Quantity}}
               }).then(function(ok){
                 console.log(ok);
               });
    res.send(store);
      }else{
        res.send({success:0,msg:"Shop doesnt exist"});
      }
    });
});


module.exports=router;
