var mongoose=require('mongoose');
var Schema=mongoose.Schema;


const ShopSchema=new Schema(
 {


    ShopName:String,
    OwnerName: String,
    OwnerPassword: String,
    ProductLine:[{
      product:String,
      price:Number,
      quantity:Number
    }],
    order:[{
      product:String,
      price:Number,
      quantity:Number
    }]
 }
);

const Shop=mongoose.model('shop',ShopSchema);

module.exports=Shop;
