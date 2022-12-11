const express = require('express');
const fs = require('fs');

const homeFile = fs.readFileSync("home.html", "utf8");
const app = express();

app.get("/",(req,res) => {
    res.redirect("home");
})

app.get("/home",(req,res) => {
    res.send(`${homeFile}`);
})
app.listen(3000,()=>{
    console.log("Server started at port 3000");
})