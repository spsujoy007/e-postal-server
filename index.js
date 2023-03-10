const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ke0m0t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        const postCollection = client.db('e-postal').collection('postcollection');
        const commentsCollection = client.db('e-postal').collection('commentsCollection');
        const aboutCollection = client.db('e-postal').collection('aboutCollection');

        app.post('/posts', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post)
            console.log(result);
            res.send(result)
        });

        app.get('/posts', async(req, res) => {
            const query = {};
            const result = await postCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/posts/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await postCollection.findOne(query);
            res.send(result)
        })

        app.put('/postlike/:todo', async(req, res) => {
            const todo = req.params.todo;
            
            const id = req.query.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};

            //for find the current like with exact id
            const findme = await postCollection.findOne(filter);
            const oldLike = parseInt(findme.likecount)
            //end

                console.log('plus hobe')
                const updatedDoc = {
                    $set: {
                        "likecount": oldLike + 1
                    }
                }
                const result = await postCollection.updateOne(filter, updatedDoc, options)
                res.send(result)

        });

        app.post('/comments', async(req, res) => {
            const comment = req.body;
            const result = await commentsCollection.insertOne(comment);
            res.send(result)
        })

        app.get('/comments', async(req, res) => {
            const query = {};
            const result = await commentsCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/about', async(req, res) => {
            const aboutBody = req.body;
            const result = await aboutCollection.insertOne(aboutBody)
            res.send(result)
        })

        app.get('/about/:email', async(req, res) => {
            const email = req.params.email;
            const query = {user_email: email};
            const result = await aboutCollection.findOne(query);
            res.send(result)
        })

    }

    finally{}
}
run().catch(error => console.error(error))

app.get('/', (req, res) => {
  res.send('E-Postal Web Server (Backend)')
})

app.listen(port, () => {
  console.log(`E-Postal web server running at ${port}`)
})