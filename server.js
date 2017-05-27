const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();
app.set('view engine','ejs')

app.use(express.static('public'))

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}))

var db;

MongoClient.connect('mongodb://kishan:kishan@ds155091.mlab.com:55091/test-server',(err,database)=>{

    if(err) return console.log(err)
    db = database
    app.listen(8550,()=>{
        console.log('the test server with the database');
    })
 
})

//app.listen(3000,function(){
  //  console.log("test server")
//})

// old-method
//app.get('/',function(req,res){
//    res.send('hello world')
//})

// ES6 format
app.get('/',(req,res)=>{
    // res.send('hello world')
    //res.sendFile(__dirname + '/index.html')
    db.collection('quotes').find().toArray(function(err,result){
        console.log(result)
        
    // render to index.ejs
        res.render('index.ejs',{quotes:result});
    })
    
})

app.post('/quotes',(req,res)=>{
    db.collection('quotes').save(req.body, (err,database)=>{
        if(err) return console.log(err)
        
        console.log('saved to database')
        res.redirect('/')
    })
    console.log(req.body)
})

app.put('/quotes',(req,res) =>{
    db.collection('quotes').findOneAndUpdate(
        {name:'Yoda'},
        {$set: 
         { name: req.body.name,
          quote: req.body.quote } },
        { sort: {_id:-1 }, upsert:true},
        (err,result)=>{
            if(err) return console.log(err)
            
            res.send(result)
        }
    
    )
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})





