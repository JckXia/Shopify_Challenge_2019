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
router.post('/shopify/purchased',(req,res)=>{
    Shop.findOne({ShopName:req.body.ShopName},function(err,Shop){
       if(err) throw err;
      if(Shop){
           var product=req.body.Product;
          var productLine=Shop.ProductLine;
           console.log(productLine);
            if(productLine.length==0){
               res.send({success:0,msg:"There aren't any products atm in the store, check later!"})
              return;
            }
  /*         var Product=req.body.Product;
         var productLine=Shop.ProductLine;

         if (productLine.length==0){
           res.send({success:0,msg:"There aren't any products atm in store, check later!"})
           return;
         }
           var ProductIndex=ProductLine.indexOf(Product);
              console.log(ProductIndex);
             //var price=ProductLine[ProductIndex].price;
            //var quantity=ProductLine[ProductIndex].quantity;

          /*if(req.body.quantity>quantity||req.body.quantity<0){
            res.send({success:0,msg:"Invalid quantity!"})
            return;
          } */

          //We post this order to store.js
          //Afterwards we must subtract the quantity from the store avillable
        // console.log(ProductLine.indexOf(product));

    res.send(Shop);
      }else{
        res.send({success:0,msg:"Shop doesnt exist"});
      }
    });
});

router.get('/test',(req,res)=>{

  res.send('GET ROUTE')

});



module.exports=router;
