/*
Name:Arshit Gilhotra
Student ID:125619213
Course:WEB322
Email:garshit@myseneca.ca
*/ 

var express = require("express");
var app = express();
var path =require("path");
var exphbs = require('express-handlebars');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb+srv://garshit:mfHeMkKyMeNvZacp@assignment4.jay2pvp.mongodb.net/Assignment4?retryWrites=true&w=majority");
var registerUserSchema = new Schema({
  "firstname": String,
  "lastname": String,
  "username": {
      "type": String,
      "unique": true
  },
  "Address": String,
  "city": String,
  "postal": String,
  "country": String,
  "password": String,
    
});
var blogSchema = new Schema({
    "title": {
        "type": String,
        "unique": true
    },
    "date": String,
    "content": String,
    "image": String
      
  });
  const blogs = mongoose.model("Assignment4_blogs", blogSchema);
const newUser = mongoose.model("Assignment4_registerUser", registerUserSchema);
app.use(bodyParser.urlencoded({extended:true}));
var HTTP_PORT = process.env.PORT || 8080;
app.use(express.static("images"));

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');



// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "/index.html"));
    });
    app.get("/index", function(req,res){
      res.sendFile(path.join(__dirname, '/index.html'));
    });
  
    app.get("/blog", (req, res) => {
        blogs.find().exec().then((data) => {
            let datalog = new Array;
            data.forEach(element => {
                datalog.push({
                    title: element.title,
                    date: element.date,
                    content: element.content,
                    image: element.image
                });
            });
            res.render("blog", { title: datalog, layout: false });
        });
    });
  
   
  app.get("/article", function(req,res){
    res.render("article",{layout:false})

  });



  app.get("/login", function(req,res){

    res.sendFile(path.join(__dirname, '/login.html'));
   
});

app.post("/create", (req, res) => {

    let createArticle = new blogs({
        title: req.body.title,
        date: req.body.date,
        content: req.body.content,
        image: req.body.image
    }).save((e, data) => {
        if (e) {
            console.log(e);
        } else {
            console.log(data);
        }
    });

    
    res.redirect("administrator");
});
app.get("/administrator", (req, res) => {
    blogs.find().exec().then((data) => {
        let datalog = new Array;
        data.forEach(element => {
            datalog.push({
                title: element.title,
                date: element.date,
                content: element.content,
                image: element.image
            });
        });
        res.render("administrator", { title: datalog, layout: false });
    });
});

app.post("/admin_article", function (req, res) {
    blogs.findOne({ title: req.body.title }).exec().then((data) => {
        res.render("admin_article", { image: data.image, id: data._id, content: data.content, title: data.title, date: data.date, layout: false });
    });
});

app.post("/article", function (req, res) {
    blogs.findOne({ title: req.body.title }).exec().then((data) => {
        res.render("article", { image: data.image, id: data._id, content: data.content, title: data.title, date: data.date, layout: false });
    });
});

app.post("/update", (req, res) => {
    blogs.updateOne({
        _id: req.body.id
    }, {
        $set: {

            title: req.body.title,
            date: req.body.date,
            content: req.body.content,
            image: req.body.image
        }
    }).exec();
    res.redirect("/administrator");

});
app.post("/login", (req, res) => {
  var userdata = {
      username: req.body.username,
      pass: req.body.password,
      expression: /[~`!#@$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(req.body.username)
  }

  if (userdata.username == "" || userdata.pass == "") {
      res.render("login", { data: userdata, layout: false });
      return;
  }

  if (userdata.expression) {
      res.render("login", { data: userdata, layout: false });
      return;
  }
  newUser.findOne({ username: userdata.username, password: userdata.pass }, ["firstname", "lastname", "username"]).exec().then((data) => {
    if (data) {
        if (data.id == "637334404c1dbec03e38862b") {
            res.render("administrator", { layout: false });
            return;
        }
        else {
            res.render("dashboard_user", { firstname: data.firstname, lastname: data.lastname, username: data.username, layout: false });
            return;
        }
    } else {
        res.render("login", { error: "password and username incoorect,try again", layout: false });
        return;
    }
});

});

app.get("/registration", function(req,res){
  res.sendFile(path.join(__dirname, '/registration.html'));  
});

app.post("/registration", (req, res) => {
  var userdata = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        phonenumber: req.body.phonenumber,
        phonenumtest: /^\d{10}$/.test(req.body.phonenumber),
        city: req.body.city,
        Address: req.body.Address,
        postalcode: req.body.postalcode,
        country: req.body.country,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword
}

var passtest =() =>{
  if(userdata.password ==userdata.confirmpassword)
{
  return true;
}
else
{
  return false;
}
}
userdata.test = passtest;


if(userdata.username=="" ||
   userdata.lastname==""||
   userdata.phonenumber ==""||
  userdata.city ==""||
  userdata.Address==""||
  userdata.postalcode==""||
  userdata.country ==""||
  userdata.password ==""||
  userdata.confirmpassword =="")
   {
    res.render("registration", { data: userdata, layout: false });
    return;
   }
   if (!userdata.phonenumtest) {
    res.render("registration", { data: userdata, layout: false });
    return;
}
  if(!userdata.test)
  {
    res.render("registration", { data: userdata, layout: false });
    return;
  }
  
  let user = new newUser({
    firstname: userdata.firstname,
    lastname: userdata.lastname,
    username: userdata.username,
    Address: userdata.Address,
    city: userdata.city,
    postal: userdata.postalcode,
    country: userdata.country,
    password: userdata.password
}).save((e, data) => {
    if (e) {
        console.log(e);

    } else {
        console.log(data);

    }
});
  res.render("dashboard_user", {firstname: userdata.firstname, lastname: userdata.lastname, username: userdata.username,layout: false });
  
});


app.use(function(req,res){
  res.status(404).send("Page not found")
});

 
// setup another route to listen on /about

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT,onHttpStart());


