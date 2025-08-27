const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express = require('express');
const app=express();
const path=require('path');
const methodOverride = require('method-override');
const { use } = require('react');


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true})); 

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"delta_app",
    password:"Kavya@123",
});

// let q="SHOW TABLES";
// let q1="INSERT INTO user1(id,username,email,password) VALUES ?";
// let users1=[["554a","kavya122","kk@gmail.com","aadd12"],["534b","kavya142","kk1@gmail.com","affd12"]];
// try
// {
// connection.query(q1,[users1],(err,result)=>{
//    if (err) throw err;
//    console.log(result);
// });
// }
// catch(err)
// {
//     console.log(err);
// }

// try
// {
// connection.query(q,(err,result)=>{
//    if (err) throw err;
//    console.log(result);
//     console.log(result.length);
//     console.log(result[0]);
//     console.log(result[1]);
// });
// }
// catch(err)
// {
//     console.log(err);
// }
let createRandomUser=()=>{
  return [
    faker.string.uuid(),
     faker.internet.username(),
    faker.internet.email(),
     faker.internet.password(),
  ];
}
// let data=[];
// for(let i=0;i<100;i++)
// {
//   data.push(createRandomUser());
// }
// try
// {
// connection.query(q1,[data],(err,result)=>{
//    if (err) throw err;
//    console.log(result);
// });
// }
// catch(err)
// {
//     console.log(err);
// }
// connection.end();

app.get("/",(req,res)=>{
  try
{
let q5=`SELECT count(*) FROM user1`; 
connection.query(q5,(err,result)=>{
  if(err){
    throw err;
  }
  let count=result[0]["count(*)"];
   res.render("home.ejs",{count});
});
}
catch(err)
{
    console.log(err);
    res.send("Error in DB");
} 
});

app.get("/user",(req,res)=>{
  let q=`SELECT * FROM user1`;
try
{
connection.query(q,(err,result)=>{
   if (err) throw err;
  //  console.log(result);
   res.render("showusers.ejs",{result});
});
}
catch(err)
{
    console.log(err);
}
});

app.get("/user/:id/edit",(req,res)=>{
  let{id}=req.params;
  console.log(id);
  let q=`SELECT * FROM user1 WHERE id='${id}'`;
try
{
connection.query(q,(err,result)=>{
   if (err) throw err;
    let user=result[0];
   res.render("edit.ejs",{user});
});
}
catch(err)
{
    console.log(err);
    res.send("Error in DB");
}
});
//UPDATE ROUTE
app.patch("/user/:id",(req,res)=>{
    let{id}=req.params;
    let{password: formpass, username:newUsername} =req.body;
  let q=`SELECT * FROM user1 WHERE id='${id}'`;
try
{
connection.query(q,(err,result)=>{
   if(err) throw err; 
    let user=result[0];
    if(formpass!=user.password)
    {
      res.send("Wrong Password");
    }
    else
    {
      let q2=`UPDATE user1 SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        });
    }
});
}
catch(err)
{
    console.log(err);
    res.send("Error in DB");
}
});

app.listen("8080",()=>{
  console.log("server is listening to port 8080");
});

