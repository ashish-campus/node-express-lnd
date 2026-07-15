import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('The new express App');
});

app.listen(3000);