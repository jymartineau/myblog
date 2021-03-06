import express from 'express';
import bodyParser from 'body-parser';
import  { MongoClient } from 'mongodb';

//Great Fake Database Example...
// const articlesInfo = {
//     'learn-react': {
//         upvotes: 0,
//         comments: [],
//     },
//     'learn-node': {
//         upvotes: 0,
//         comments: [],
//     },
//     'my-thoughts-on-resumes': {
//         upvotes: 0,
//         comments: [],
//     },

// }

const app = express();

app.use(bodyParser.json());

//get collection details for one entry from Mongo
app.get('/api/articles/:name', async (req, res) => {

    try {
        const articleName = req.params.name;

        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
        const db = client.db('my-blog');
    
        const articleInfo = await db.collection('articles').findOne({ name: articleName});
        res.status(200).json(articleInfo);
        client.close();

    } catch (error) {
        res.status(500).json({ message: 'Error connecting to the db', error });
    }

})

//Simple routes to endpoints
//app.get('/hello', (req, res) => res.send('Hello!'));
//app.get('/hello/:name', (req, res) => res.send(`Hello ${req.params.name}!`));
//app.post('/hello', (req, res) => res.send(`Hello ${req.body.name}!`));

//Upvote Implementation - using our little fake db in the above array articlesInfo
app.post('/api/articles/:name/upvote', (req, res) => {
    const articleName = req.params.name;

    articlesInfo[articleName].upvotes += 1;
    res.status(200).send(`${articleName} now has ${articlesInfo[articleName].upvotes} upvotes!`)
});

//Comments Implementation - using our little fake db in the above array articlesInfo
app.post('/api/articles/:name/add-comment', (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;

    articlesInfo[articleName].comments.push({ username, text });

    res.status(200).send(articlesInfo[articleName]);
});

app.listen(8000, () => console.log('Listening on port 8000'));