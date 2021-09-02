const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');

mongoose.connect('mongodb://localhost/formData', {useNewUrlParser: true, useUnifiedTopology: true})
const port = 8006;

const formSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    hobbies: String,
});

const formData = mongoose.model('formData', formSchema);

app.use('/static', express.static('static'));// For serving static files
app.use(express.urlencoded({ extended: true}));

app.set('view engine','ejs');
app.set('view engine', 'html');
app.engine('html',require('ejs').renderFile);


app.use(express.json());


 app.post("/",(req,res)=>{
    var myData = new formData(req.body);
    myData.save().then(()=>{
        // res.send("This item has been saved to the database")
        res.redirect('/');

    }).catch(()=>{
        res.status(400).send("Item was not saved to the database")
    })
   

}) 
var db;
MongoClient.connect('mongodb://localhost/formData',(err,client)=>db=client.db('formData'));

app.get('/',(req,res)=>{
db.collection('formdatas').find({}).toArray((err,result)=>{
    console.log(err);
    console.log("FormData Collection:"+ JSON.stringify( result));
    res.render('pages/formdatas.ejs',{formdatadetails : result});
});
})

// Delete Route
app.post('/delete',(req,res)=>{
var username = req.body.name;
var formdatadetails ={"name": username}
db.collection('formdatas').deleteOne(formdatadetails,(err,result)=>{
 if (err) throw err;
 console.log(result);
 res.redirect('/');
})
})


 app.listen(port, ()=>{
    console.log(`The application started sucessfully on port ${port}`);
}) 
