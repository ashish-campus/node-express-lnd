import express from 'express';
import Article from '../models/articles.js';
import expressValidator from 'express-validator';

const router = express.Router();

const articleRules = [
 expressValidator.check('title').isLength({min:1}).trim().withMessage('Title required'),
  expressValidator.check('author').isLength({min:1}).trim().withMessage('Author required'),
  expressValidator.check('body').isLength({min:1}).trim().withMessage('Body required')
];

router.get('/edit/:id', (req, res) => {
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

router.post('/edit/:id', (req, res) => {
    Article.updateOne({_id: req.params.id}, req.body).then(()=>{
        req.flash('success', 'Article Updated');
         res.redirect("/");
    }).catch(err => {
        res.status(500).send(`Error updating article with Id ${req.params.id}`);
    });
});

router.get('/delete/:id', (req, res) => {
    Article.deleteOne({ _id: req.params.id })
        .then((result) => {
            req.flash('danger', 'Article Deleted');
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error deleting article');
        });
});

router.get('/add', (req, res) => {
    let article = new Article();
    article.title ='';
    article.author ='';
    article.body ='';
    res.render('articles-add', {article});
});

router.post('/add', articleRules, (req, res) => {
    console.log(req.body);
    let article = new Article();

     const errors = expressValidator.validationResult(req);
     article.title =req.body.title;
     article.author =req.body.author;
     article.body =req.body.body;
      
     if (!errors.isEmpty()) {
  console.log(errors);
     res.render('articles-add',
      { 
       article:article,
       errors: errors.mapped()
      });
   }
   else{
    article.save().then((data) => {
        console.log('New article saved', data);
        req.flash('success', 'Article Added');
        res.redirect('/');
    }).catch(err => {
        if (err) throw err;
    });
 }
});

router.get('/:id', (req, res) => {
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

export default router;