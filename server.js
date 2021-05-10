const exp=require('express');
const app=exp();
const testRoute=require('./user-api');
const mc=require('mongodb').MongoClient;
const path=require('path');
var helmet = require('helmet');
const cors = require('cors')
 
/*var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}*/

app.use(cors());
app.use(exp.static(path.join(__dirname,'./dist/ecficio4')));
//app.use(queue({ activeLimit: 1, queuedLimit: -1 }));
app.use(helmet());
app.use('/user',testRoute);
app.use((req,res)=>{
    res.send({message:`${req.url} is invalid!`});
});

var dbUrl="mongodb+srv://baka:ittop@cluster0-ebc9w.mongodb.net/ecficio?retryWrites=true&w=majority";
mc.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology:true},(err,client)=>{
    if(err)
    {
        console.log("Err in db connect ",err);
    }
    else{
        app.locals.dbObject=client;
        console.log('connected to mongodb');
        app.listen(process.env.PORT || 3000,()=>{
            console.log("server listening on port 3000");
        });
    }
});