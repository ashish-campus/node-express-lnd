import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import mongoose from 'mongoose';
import Article from './models/articles.js';
import session from 'express-session';
import connectFlash from 'connect-flash';
import expressMessages from 'express-messages';
import expressValidator from 'express-validator';

mongoose.connect('mongodb://localhost:27017/nodedb');

let db=mongoose.connection;

// check connection
db.once('open', () => {
    console.log('connected to MongoDB');
});

//db error handling
db.on('error', (err) => {
    console.log(err);
});

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const expressMessagesMiddleware = (req, res, next) => {
    res.locals.messages = expressMessages(req, res);
    next();
};

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'abcd',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
}));
app.use(connectFlash());
app.use(expressMessagesMiddleware);

const articleRules = [
 expressValidator.check('title').isLength({min:1}).trim().withMessage('Title required'),
  expressValidator.check('author').isLength({min:1}).trim().withMessage('Author required'),
  expressValidator.check('body').isLength({min:1}).trim().withMessage('Body required')
];

app.get('/', (req, res) => {
    Article.find({}).then((articles) => {
        res.render('index', {articles});
    }).catch(err => {
         console.log(err);
      res.status(500).send('Error fetching articles');
    });
    
});


app.get('/articles/edit/:id', (req, res) => {
    Article.findById(req.params.id)
    .then(article => {
        console.log(article);
        res.render('edit_article', {article});
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(`Error fetching article with Id ${req.params.id}`);
    });
});
app.post('/articles/edit/:id', (req, res) => {
    Article.updateOne({_id: req.params.id}, req.body).then(()=>{
        console.log('updated successfully');
         res.redirect("/");
    }).catch(err => {
        res.status(500).send(`Error updating article with Id ${req.params.id}`);
    });
});

app.get('/articles/delete/:id', (req, res) => {
    Article.deleteOne({ _id: req.params.id })
        .then((result) => {
            console.log(result);
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error deleting article');
        });
});

app.get('/articles/add', (req, res) => {
    res.render('articles-add');
});

app.post('/articles/add', articleRules, (req, res) => {
    console.log(req.body);
    let article = new Article();

     const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
  console.log(errors);
     res.render('articles-add',
      { 
       article:article,
       errors: errors.mapped()
      });
   }
   else{
    article.title =req.body.title;
    article.author =req.body.author;
    article.body =req.body.body;
    article.save().then((data) => {
        console.log('New article saved', data);
        res.redirect('/');
    }).catch(err => {
        if (err) throw err;
    });
 }
});

app.get('/articles/:id', (req, res) => {
    Article.findById(req.params.id)
    .then(article => {
        console.log(article);
        res.render('article', {article});
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(`Error fetching article with Id ${req.params.id}`);
    });
});

app.listen(3000);