//all current comments are about todos (sorry)
const path = require('path');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/battleships', {useNewUrlParser: true});
let db = mongoose.connection;

db.once('open', ()=>{
    console.log('connected to MongoDB.');
});

db.on('error', (err)=>{
    console.log(err);
});

let Accounts = require('./models/account');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));



app.get('/highscores', (req, res)=>{
    var query = Accounts.find({}, {'_id': 0});
    query.select('username mantra rank');
    query.sort({rank: 1});
    query.exec((err, accounts)=>{
        res.render('highscore', {accounts: JSON.stringify(accounts)});
    });
});

app.get('/account', (req, res)=>{
    //if req.query is empty, set the query username to userUsername from cookies
        //if no user is logged on then redirect to login
    console.log(req.cookies);
    Accounts.findOne(req.query, (err, account)=>{
        if(req.query.username == req.cookies.userUsername){
            res.render('accountself', {
                userAccount: account
            });
        } else {
            res.render('accountother', {
                account: account
            });
        }
    });
});

app.get('/login', (req, res)=>{
    //redirect to account if user is already logged in
    res.render('login', {credentialsValid: true});
});

app.post('/login', (req, res)=>{
    Accounts.findOne({"username": req.body.username, "password": req.body.password}, (err, account)=>{
        if(account){
            res.cookie('userUsername', account.username);
            res.redirect('/account?username='+account.username);
        } else {
            res.render('login', {credentialsValid: false});
        }
    });
});


app.get('/image', (req, res)=>{
    //redirect to login if user is not logged in
    res.render('editimage');
});

app.post('/image', (req, res)=>{
    var userUsername = req.cookies.userUsername;
    var image = null;
    if(req.body.profile1 === 'select')
        image = 'profile1.png';
    else if(req.body.profile2 === 'select')
        image = 'profile2.png';
    else if(req.body.profile3 === 'select')
        image = 'profile3.png';
    
    Accounts.findOne({'username': userUsername}, (err, account)=>{
        account.image = image;
        account.save();
        res.redirect("/account?username="+userUsername);
    });
});

app.get('/mantra', (req, res)=>{
    //redirect to login if user is not logged in
    res.render("editmantra");
});

app.post('/mantra', (req, res)=>{
    var userUsername = req.cookies.userUsername;
    var mantra = req.body.mantra;
    Accounts.findOne({"username": userUsername}, (err, account)=>{
        account.mantra = mantra;
        account.save();
        res.redirect("/account?username="+userUsername);
    });
});

app.get('/register', (req, res)=>{
    res.render('register');
});

app.post('/register', (req, res)=>{
    Accounts.findOne({"username": req.body.username}, (err, account)=>{
        //handle error here

        if(account){
            res.render('register', {usernameTaken: true});
        } else {
            let user = new Accounts();
            user.username = req.body.username;
            user.password = req.body.password;
            user.birthDay = req.body.day;
            user.birthMonth = req.body.month;
            user.birthYear = req.body.year;
            user.image = "profile1.png";
            user.mantra = "default mantra";
            user.save((err, docs)=>{
                if(err){
                    console.log(err);
                }else{
                    Accounts.countDocuments({}, (err, c)=>{
                        user.rank = c;
                        user.save((err)=>{
                            if(err) console.log(err);
                        });
                    });
                }
            });
            res.cookie('userUsername', user.username);
            res.redirect('account?username='+user.username);
        }
    });
});



app.listen(3000, ()=>{
    console.log("database listening to port 3000...");
});
