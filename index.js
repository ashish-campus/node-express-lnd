import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import mongoose from 'mongoose';
import Article from './models/articles.js';
import session from 'express-session';
import connectFlash from 'connect-flash';
import router from './routes/article.routes.js'

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

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'abcd',
    resave: true,
    saveUninitialized: true
}));
app.use(connectFlash());
const expressMessagesMiddleware = (req, res, next) => {
    res.locals.messages = req.flash();
    console.log('typeof res.locals.messages:', typeof res.locals.messages);
    next();
};
app.use(expressMessagesMiddleware);

app.get('/', (req, res) => {
    console.log('session on GET /:', req.session);
    Article.find({}).then((articles) => {
        res.render('index', {articles});
    }).catch(err => {
         console.log(err);
      res.status(500).send('Error fetching articles');
    });
    
});

app.use('/articles',router);

app.listen(3000);