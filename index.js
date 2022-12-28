const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        app.post('/posts', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post)
            console.log(result);
            res.send(result)
        })

        app.get('/posts', async(req, res) => {
            const query = {};
            const result = await postCollection.find(query).toArray();
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