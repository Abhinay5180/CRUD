const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');

mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost/formData', {useNewUrlParser: true, useUnifiedTopology: true})
const port = process.env.PORT || 8006;

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
//         res.send("This item has been saved to the database")
        res.redirect('/');

    }).catch(()=>{
        res.status(400).send("Item was not saved to the database")
    })
   

}) 

app.get('/',(req,res)=>{
formData.find({},(err,formdatas)=>{
 res.render('pages/formdatas.ejs',{formdatadetails : formdatas});    
})
   
})

// Delete Route
app.post('/delete',(req,res)=>{
var username = req.body.name;
var formdatadetails ={"name": username}
formData.deleteOne(formdatadetails)
  res.redirect('/');
})


 app.listen(port, ()=>{
    console.log(`The application started sucessfully on port ${port}`);
}) 
