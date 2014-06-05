/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var mongoose = require('mongoose');


// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  mongoose.connect('mongodb://localhost/fbdemo');
}
//var now = new Date();
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return "  " +year + " - " + month + " - " + day + "   " + hour + " : " + min + " : " + sec;

}

var Schema = new mongoose.Schema({
	//_id:String,
	give_word:String,
	give_TopNo:String,
        visit_date:String,
	visit_ip:String
});


var user = mongoose.model('evm',Schema);



app.get('/',function(req,res){
res.render("index.hjs",{abc: "please input the word and top number"+"\n",ddd: req.ip+"\n",ttt:getDateTime()});
});
app.post('/login',function(req,res){
    var myresult ="";
    var child = require("child_process");
    var binaddress ="./vectors.bin"; 
    var giveword = req.body.nameword;
    var TopNo = req.body.topNo;
    var mycmd = "java -jar word2vec.jar" +" "+binaddress +" "+ giveword +" " + TopNo;
    run = child.exec(mycmd, function (error, stdout, stderr) {
	    if (error != null) {
	      		console.log('exec error: ' + error);
	    	}
        myresult = stdout;
        
        new user({
		//_id  :Schema.ObjectId,
		give_word :req.body.nameword,
		give_TopNo  :req.body.topNo,
		visit_date:getDateTime(),
		visit_ip:req.ip

	}).save(function(err,doc){
	    if(err) res.json(err);
		//else res.send("successfully inserted");
	});
	res.render("index.hjs",{abc: myresult + "\n",ddd: req.ip,ttt:getDateTime()});  
      }); 
/*
      setTimeout(function() {    
     console.log('outer(exec()) of the myresult value is: '+myresult); 
     //res.render("index.hjs",{abc: myresult + "\n",ddd: req.ip,ttt:Date.now()});   
	},1000);
       setTimeout(function() {
          console.log("hello world");
           res.render("index.hjs",{abc: str+"."})
        }, 2000);
*/

        //console.log("post section run: "+run.on);
	//res.render("index.hjs",{abc:myresult+"\n",ddd: req.ip});
       //res.render("index.hjs",{abc: login2(req, res)+"\n"});

});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  //console.log("this is end: "+myresult);
});    
	  
