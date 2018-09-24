# MyStorifi
---

# Project Overview:  
  An app  that emulates an e-commerce website backend. 
  The app supports CRUD operations as well as simple security measures
  such as json web token for access to the product line
 
 ## Running the app 
  This project is written with Node.js and user data is stored in 
  a mongodb database. 
  To install/run the backend,  one need to run  
  ```
npm install
```
  The data is served from a mongodb database. Further plans include deploying the API to a cloud.
  At the momment, initate a mongodb client from cmd. Once this is finished, we run 
  ```
  nodemon/node app.js
  ```
  To import the database , run
  ```
  mongoimport --db <dbName> --collection <collectionName> --file dbExpt.json
  ```
## API routes
##### Login Route url:
localhost:8000/shopify/login 

##### Type: POST
##### Description:
  A post request is made with information containing
  the store's admin. A jwt token will be returned 
  which allows the app user to made changes to the products
  in the productLine 

##### Request body example: 

{
 "ShopName":"Microsoft"
 "OwnerName":Jack
 "OwnerPassword":1857
}

___
##### AdminRemove Route url:
localhost:8000/shopify/AdminRemove

##### Type: DELETE
##### Description:
  A delete request is made once the user is authenticated. 
  It allows users to delete products in the productLine 
  of a given store

##### Request body example: 
{
 "Product":"Chicken"
}
----
##### AdminAdd Route url:
localhost:8000/shopify/AdminAdd

##### Type: POST
##### Description:
  A delete request is made once the user is authenticated. 
  It allows users to add products in the productLine 
  of a given store

##### Request body example: 
{
 "Product":"Chicken",
 "Price":"50",
 "Quantity":20
}
---
##### Browse Route url:
localhost:8000/shopify/browse

##### Type: POST
##### Description:
  A post request is made with the request body containing the 
  name of the shop. The productLine of that particular store will be returned
##### Request body example: 
{
 "ShopName":"MSFT"
}
--- 
##### CreateStore Route url:
localhost:8000/shopify/CreateStore
##### Type: POST
##### Description:
  A post request is made with the request body containing the 
  basic schema of the store
##### Request body example: 
{
 "OwnerName":"Jack",
 "OwnerPassword":"134",
  "ShopName":"Rasp",
   "ProductLine":[{"product":"Milk","price":15,"quantity":20}],
   "order":[]
}
---
##### Purchase Route url:
localhost:8000/shopify/purchase
##### Type: POST
##### Description:
  A post request is made with the request body containing the 
  store name, product intent to purchase and the quantity of the product
##### Request body example: 
{
 "OwnerName":"Jack",
 "OwnerPassword":"134",
  "ShopName":"Rasp",
   "ProductLine":[{"product":"Milk","price":15,"quantity":20}],
   "order":[]
}
---

## Dependencies:
Mongodb
Express,
passport,
passport-jwt,
jwt,
Node 

### Note about ES6
Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write. 



