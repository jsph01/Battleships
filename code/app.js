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

app.get('/', (req,res)=>{
    var userUsername = req.cookies.userUsername;
    if(userUsername)
        res.redirect('account?username='+userUsername);
    else
        res.redirect('login');
});

app.get('/gameselection', (req, res)=>{
    res.render('gameselection');
});

app.get('/singlegame', (req, res)=>{
    res.render('singlegame');
});

app.get('/multigame', (req, res)=>{
    res.render('multigame');
});

app.get('/highscores', (req, res)=>{
    var query = Accounts.find({}, {'_id': 0});
    query.select('username mantra rank');
    query.sort({rank: 1});
    query.exec((err, accounts)=>{
        res.render('highscore', {accounts: JSON.stringify(accounts)});
    });
});

app.get('/account', (req, res)=>{
    var userUsername = req.cookies.userUsername;
    if(!req.query.username){
        if(userUsername){
            req.query.username = userUsername;
        }else{
            res.redirect('login');
        }
    }
    
    Accounts.findOne(req.query, (err, account)=>{
        if(req.query.username == userUsername){
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
    res.render('editimage');
});

app.post('/image', (req, res)=>{
    var userUsername = req.cookies.userUsername;
    if(userUsername){
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
    }else{
        res.redirect('login');
    }
});

app.get('/mantra', (req, res)=>{
    res.render("editmantra");
});

app.post('/mantra', (req, res)=>{
    var userUsername = req.cookies.userUsername;
    if(userUsername){
        var mantra = req.body.mantra;
        Accounts.findOne({"username": userUsername}, (err, account)=>{
            account.mantra = mantra;
            account.save();
            res.redirect("/account?username="+userUsername);
        });
    }else{
        res.redirect('login');
    }
});

app.get('/register', (req, res)=>{
    res.render('register');
});

app.post('/register', (req, res)=>{
    Accounts.findOne({"username": req.body.username}, (err, account)=>{
        if(err){
            console.log(err);
        }else if(account){
            res.render('register', {usernameTaken: true});
        }else{
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
