const exp=require('express');
const testRouter=exp.Router();
var handlebars = require('handlebars');
var fs = require('fs');
var queue = require('express-queue');
const emailExistence=require('email-existence');
const nodemailer=require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var pdf = require("pdf-creator-node");
let Razorpay=require('razorpay');

/****************************************************/
//read ereceipt html template
var htmlToPDF = fs.readFileSync('./views/pdf.html','utf8');

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
        }
        else {
            callback(null, html);
        }
    });
};
smtpTransport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
        user: 'abbhinav.nomulla656@gmail.com',
        pass: 'BakaIttop@123'
    },
    tls: {
        rejectUnauthorized: false
    }
}));
/****************************************************/


/****************************************************/
//razorpay configuration
    //test key
var razor_key='rzp_test_zbCOB17vdZyS2s'
var RazorpayConfig={
    key_id: 'rzp_test_zbCOB17vdZyS2s',
    key_secret: 'AXknIpwIlGjT41aaM5sLmHgC'
}
    //live key
/*var razor_key='rzp_live_rRpOBnhWPSO0YL'
const RazorpayConfig={
    key_id: 'rzp_live_rRpOBnhWPSO0YL',
    key_secret: 'wzOETZCMWykeL7BFbZKBFrEI'
}*/
testRouter.use(exp.json());
testRouter.post('/razorpayOrder',(req,res,next)=>{
    var razorinstance=new Razorpay(RazorpayConfig);
    var options = {
        amount: 10000,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "",
        payment_capture: '1'
      };
    razorinstance.orders.create(options,function(razor_error, order){
        if(razor_error){
            console.log(razor_error);
            res.send({message: 'error'});
        }
        else{
            console.log(order);
            res.send({message: 'success',order: order,key: razor_key,amount: options.amount});
        }
    });
});
/****************************************************/


//to check whether the mail exists or not
testRouter.use(exp.json());
testRouter.post('/validEmail',(req,res,next)=>{
    let dbo=req.app.locals.dbObject.db('ecficio4');
    emailExistence.check(req.body.email, function(error,response){
        if(error)
        {
            res.send(error);
        }
        else
        {
            if(response)
            {
                dbo.collection('users').findOne({phone:req.body.phone},(errr,objj)=>{
                    if(errr){
                        console.log(errr);
                        next(errr);
                    }
                    if(objj==null)
                    {
                        console.log(response);
                        res.send({message: 'success'});
                    }
                    else
                    {
                        res.send({message: 'already exists'});
                    }
                });
            }
            else    
                res.send({message: 'enter real email'});
        }
});
});



//to register the online registered user
testRouter.use(exp.json());
testRouter.post('/addEUser',queue({ activeLimit: 1, queuedLimit: -1 }),(req,res,next)=>{
    let dbo=req.app.locals.dbObject.db('ecficio4');
    dbo.collection('receipt').findOne({name:"baka"},(err,obj)=>{
        if(err) {
         console.log(err);
         next(err);
        }
        else if(obj==null){
            res.send({message:"not found"});
        }
        else
        {
            var count=obj.no;
            req.body.receipt=count;
            dbo.collection('users').findOne({phone:req.body.phone},(errr,objj)=>{
                if(errr){
                    console.log(errr);
                    next(errr);
                }
                else if(objj==null){
                    
                    dbo.collection('users').insertOne(req.body,(errrr,suc)=>{
                        if(errrr){
                            console.log(errrr);
                            next(errrr);
                        }
                        else{
                            count=count+1;
                            dbo.collection('receipt').updateOne({name: "baka"},{$set: {no:count}},(error,success)=>{
                                if(error){
                                    console.log(error);
                                    next(error);
                                }
                                else{
                                    count=count-1;
                                    var options = {
                                        format: "A4",
                                        orientation: "portrait",
                                        border: "3mm"
                                    };
                                    var document = {
                                        html: htmlToPDF,
                                        data: {
                                            name: req.body.name,
                                            receipt: count,
                                            clg: req.body.college,
                                            rollno: req.body.rollno,
                                            date: req.body.timestamp,
                                            tid: req.body.transactionid
                                        },
                                        path: "./users_pdf/"+count+"_"+req.body.name+".pdf"
                                    };
                                    pdf.create(document, options).then(ress => {
                                        console.log(ress);
                                        readHTMLFile(__dirname + '/views/registration.html', function(err, html) {
                                            var template1 = handlebars.compile(html);
                                            var replacements = {
                                                receipt: count,
                                                name: req.body.name
                                            }
                                            var htmlToSend = template1(replacements);
                                            var mailOptions = {
                                                from: '"ecficio" <abbhinav.nomulla656@gmail.com',
                                                to: req.body.email,
                                                cc: 'abhinav_n17@vnrvjiet.in',
                                                attachments: [
                                                    {
                                                        filename: count+"_"+req.body.name+".pdf",
                                                        path: "./users_pdf/"+count+"_"+req.body.name+".pdf"
                                                    }
                                                ],
                                                subject: 'Successfully Registered for Ecficio4.0!!',
                                                html : htmlToSend
                                            };
                                            smtpTransport.sendMail(mailOptions, function (error, response) {
                                                if (error) {
                                                    console.log(error);
                                                    res.send({message: 'error'});
                                                }
                                                res.send({message:"success",receipt:count});
                                                console.log('subscription mail sent');
                                            });
                                        });        
                                    }).catch(error => {
                                        console.log(error);
                                        
                                        res.send({message: 'error'});
                                    });
                                    
                                }
                            });
                        }
                    });
                }
                else{
                    res.send({message:'already exists'});
                }
            });
        }
    });
});

//if there is any logical errors in code
testRouter.use((err,req,res,next)=>{
    res.send({message:err.message});
});

module.exports=testRouter;