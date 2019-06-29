// var Faker=require("faker");
// // var randomProduct=Faker.commerce.productName();
// // var randomPrice=Faker.commerce.price();
var faker=require("faker");
for(var i=0; i<10; i++){
var p=faker.commerce.productName();
var r=faker.commerce.price();
console.log(p+" - $"+r);
}