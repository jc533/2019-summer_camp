var express = require('express');
var router = express.Router();
var multer  = require('multer');
var { ObjectID } = require('mongodb'); // MongoDB _id
var walk = require('walk');
var path = require('path');
var basicAuth = require('basic-auth');
var sha256 = require('sha256');
var config = require('../config');
var fs = require('fs');
// var fcm = require('../fcm');

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './upload');
    },
    filename: function(req, file, callback) {
        console.log(file);
        var name=req.body.fullname+'_'+Date.now()+path.extname(file.originalname);
        req.body.parentalConsent = name;
        callback(null, name);
    }
});

var upload = multer({ storage: storage });
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '首頁', reg: config.reg() });
});
router.get('/guide',function(req, res, next) {
    res.render('guide', { title: '簡介', reg: config.reg() });
});
router.get('/qna',function(req, res, next) {
    res.render('qna', { title: 'Q&A', reg: config.reg() });
});
router.get('/register',function(req, res, next) {
    res.render('register', { title: '報名', reg: config.reg() });
});
router.get('/schedule', function(req, res, next) {
    res.render('schedule', { title: '課表', reg: config.reg() , Subject: readSubject() });
});
router.get('/history', function(req, res, next) {
    var files = [];
    var walker = walk.walk('images/2017', {followLinks: false});
    walker.on('file', function(root, start, next) {
        files.push(root + '/' + start.name);
        next();
    });
    walker.on('end', function() {
        files = shuffle(files);
        res.render('history', { title: '回顧', reg: config.reg() , ImageFiles: files });
    });
});
router.put('/register', upload.single('parentalConsent'), function(req, res, next) {
    if (config.reg() != "start") {
        res.status(403).send("!start");
        return null;
    }
    console.log(req.body);
    writeRegLog(JSON.stringify(req.body));
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017";
    var param1 = req.body;
    if (!param1.fullname         ||
        !param1.gender           ||
        !param1.size             ||
        !param1.parentName       ||
        !param1.phone            ||
        !param1.email            ||
        !param1.eat              ||
        !param1.id               ||
        !param1.birthday         ||
        !param1.transport        ||
        !param1.emergencyContact ||
        !param1.parentalConsent  ){
        console.log(param1);
        res.status(400).send('Error');
    } else {
        MongoClient.connect(url, function(err, client) {
            var db = client.db('2018-cscamp');
            db.collection('register').insert(param1, function(err, doc) {
                if (err) {
                    res.status(500).send('Error');
                } else {
                    res.send('Success');
                    db.collection('register').find().toArray(function(err,result){
                        if(err) {
                            throw err;
                        } 
                        // else {
                            // fcm.send(result.length);
                        // }
                    });
                }
            });
        });
    }
});
var authorize = function(req, res, next){
    function unauth(res){
        res.set("WWW-Authenticate", "Basic realm=\"Authorization Required\"");
        return res.status('401').send("Authorization Required");
    }
    var user = basicAuth(req);
    if(!user || !user.name || !user.pass){
        return unauth(res);
    }
    if(sha256(sha256(user.name)) === '8da02532d45e8453c2af4f6f358d6a2efcfd583db0c388e9464e61903c9572db' && sha256(sha256(user.pass)) === '66d44b8d09f8dc5cbfe76b77caa96f72c00509d07850f3cc0316667c9d84f3d3'){
        return next();
    } else {
        return unauth(res);
    }
};
router.get('/security', authorize , function(req, res, next){
    var MongoClient = require('mongodb').MongoClient;
    var mongoLink = "mongodb://localhost:27017";
    MongoClient.connect(mongoLink, function(err, client) {
        var db = client.db('2018-cscamp');
        db.collection('register').find().toArray(function(err , results){
            if(err){
                throw err;
            }else{
                res.render("panel", {title: "Panel", Data: results, reg: config.reg()});
                client.close();
            }
        });
    });
});
router.get('/api/getRegisterData', authorize , function(req, res, next) {
    console.log('Download Requestsed');
    res.download(path.resolve(__dirname,'../2018_cscamp_registration.zip'),'2018_cscamp_registration.zip');
})
function shuffle(arr) {
    var i,j,temp;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
};
function readSubject() {
    var obj = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../subjects.json"), 'utf8'));
    return obj;
}
function writeRegLog(data) {
    data += "\n";
    fs.appendFile(path.resolve(__dirname, "../log/register.log"), data, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Append operation complete.');
        }
    });
}
module.exports = router;