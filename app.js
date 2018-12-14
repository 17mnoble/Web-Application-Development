var express = require("express");// The app needs the express module so it will work 
var app = express();// invoke express application
var fs = require('fs');

// Renders everything in the views folder
app.use(express.static("views"));

//Renders everything in the images folder
app.use(express.static("images"));

//Renders everything in the scripts folder
app.use(express.static("scripts"));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//Allow access to JSON
var contact = require("./model/contact.json")


//View engine & render pages
app.set("view engine","ejs"); //This line sets the defaut view engine

app.get("/about", function(req, res) {
res.render("about.ejs"); // we use the res.render command to on the response object to display the ejs page as html
console.log("About page has been displayed"); // used to output activity in the console
});

app.get("/bio", function(req, res) {
res.render("bio.ejs"); // we use the res.render command to on the response object to display the ejs page as html
console.log("Bio page has been displayed"); // used to output activity in the console
});


app.get("/", function(req, res) {
res.render("index.ejs"); // we use the res.render command to on the response object to display the ejs page as html
console.log("Index page has been displayed"); // used to output activity in the console
});


//------------------------- Contact Us Page -------------------------


app.get("/contact", function(req, res) {
res.render("contact.ejs",{contact}); // we use the res.render command to on the response object to display the ejs page as html
console.log("Contact page has been displayed"); // used to output activity in the console

});


//------------------------- Add Contact Page -------------------------



// route to render contact info page 
app.get("/addcontact", function(req, res){
    
// res.send("This is the best class ever");
    res.render("addcontact.ejs");
    console.log("on addcontact add page!")
    
});


// route to render to the add contact page 
app.get("/addcontact", function(req, res){
    
   // res.send("This is the best class ever");
    res.render("addcontact.ejs");
    console.log("on contacts page!")
    
});

// route to render contact info page 
app.post("/addcontact", function(req, res){
    
// function to find the max id
function getMax(contacts , id) {
var max
for (var i=0; i<contacts.length; i++) {
if(!max || parseInt(contact[i][id]) > parseInt(max[id]))
max = contacts[i];
}
return max;
}
var maxPpg = getMax(contact, "id"); // This calls the function above and passes the result as a variable called maxPpg.
var newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
console.log(newId); // We console log the new id for show reasons only
    
// create a new product based on what we have in our form on the add page 
var contactsx = {
    name: req.body.name,
    Comment: req.body.comment,
    id: newId,
    email: req.body.email
    
  };
    
     console.log(contactsx);
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  // The following function reads the new data and pushes it into our JSON file
  fs.readFile('./model/contact.json', 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } 
    else {
      contact.push(contactsx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(contact, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./model/contact.json', json, 'utf8')
    }
    
  })
  res.redirect("/contact");
});


//-------------------------------------------Delete Contact--------------------------------------------------
app.get("/deletecontact/:id", function(req, res){
    
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  var keyToFind = parseInt(req.params.id) // Getes the id from the URL
  var data = contact; // Tell the application what the data is
  var index = data.map(function(d) {return d.id;}).indexOf(keyToFind)
  console.log("variable Index is : " + index)
  console.log("The Key you ar looking for is : " + keyToFind);
  
  contact.splice(index, 1);
  json = JSON.stringify(contact, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./model/contact.json', json, 'utf8')
  res.redirect("/contact");
    
});

//-------------------------------------------Edit Contact--------------------------------------------------
app.get('/editcontact/:id', function(req, res){
 function chooseProd(indOne){
   return indOne.id === parseInt(req.params.id)
  
 }
 
  var indOne = contact.filter(chooseProd);
  
   res.render('editcontact' , {indOne});
 
 });




// Create post request to edit the individual review
app.post('/editcontact/:id', function(req, res){
 var json = JSON.stringify(contact);
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 var data = contact; // declare data as the reviews json file
  var index = data.map(function(contact) {return contact.id;}).indexOf(keyToFind)
 //var index = data.map(function(contact){contact.id}).keyToFind // use the paramater passed in the url as a pointer to find the correct review to edit
  //var x = req.body.name;
 var y = req.body.comment
 var z = parseInt(req.params.id)
 contact.splice(index, 1, {name: req.body.name, Comment: y, id: z, email: req.body.email});
 json = JSON.stringify(contact, null, 4);
 fs.writeFile('./model/contact.json', json, 'utf8'); // Write the file back
 res.redirect("/contact");
});


//Now we need to tell the application where to run
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    console.log("Yuppa it's running");
});