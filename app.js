var express=require('express');
const routes=require('./routes/api');
const cors=require('cors');

var app=express();

var bodyParser=require('body-parser');
var mongoose=require('mongoose');

//Connect to a mongodb database
mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost/shopify');
mongoose.Promise=global.Promise;


app.use(bodyParser.json());


app.use(routes);

app.use(routes);

//Listenning on port 8000
var port=process.env.PORT||8000;

app.listen(port,function(){
  console.log('Now listening on '+port);
});
