import express from 'express';
import bodyParser from 'body-parser';
import  { MongoClient } from 'mongodb';

const app = express();

app.use(bodyParser.json());

//this one is good, it calls Mongo for reading and updating, but there is alot of repeat code to get a connection going, look for errors and then close the connection down. so we're going to write a new function to handle the set up and tear down of the db connection necessities.

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

//Upvote Implementation
app.post('/api/articles/:name/upvote', async (req, res) => {
    const articleName = req.params.name;

    try {
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
        const db = client.db('my-blog');

        const articleInfo = await db.collection('articles').findOne({ name: articleName});
        await db.collection('articles').updateOne({ name: articleName }, {
            '$set': {
                upvotes: articleInfo.upvotes + 1,
            },
    });

    const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
    
    res.status(200).json(updatedArticleInfo);
    client.close();
        
    } catch (error) {
        res.status(500).json({ message: 'Error connecting to the db', error });
    }

    
});

//Comments Implementation
app.post('/api/articles/:name/add-comment', (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;

    articlesInfo[articleName].comments.push({ username, text });

    res.status(200).send(articlesInfo[articleName]);
});

app.listen(8000, () => console.log('Listening on port 8000'));