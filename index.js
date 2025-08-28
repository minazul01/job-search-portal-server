const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const port = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())

// scQrsfhGZ4sZbHh2

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eyk5ydv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {

  // Collect create
  const addJobCollection = client.db("Job-search-portal").collection('addJob');
  

  // addJob post jobs
  app.post('/posts', async (req, res) => {
    const data = req.body;
    const result = await addJobCollection.insertOne(data);
    res.send(result);
  });

  // add get jobs
  app.get('/posts', async (req, res ) => {
    const result = await addJobCollection.find().toArray();
    res.send(result);
  });

//  pacific user post job find
app.get('/posts/:email', async(req, res) => {
  const email = req.params.email;
  const query = {'buyer.email': email};
  const result = await addJobCollection.find(query).toArray();
  res.send(result);
});

// job post delete
app.delete('/posts/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await addJobCollection.deleteOne(query);
  res.send(result);
});

// single id to the find job post
app.get('/post/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await addJobCollection.findOne(query);
  res.send(result);
});

// update the pacific job post
app.put('/post/:id', async (req, res) => {
    const id = req.params.id;
    const postData = req.body;
    const updateDocs = {
      $set: postData,
    };
    const query = {_id: new ObjectId(id)};
    const options = {upsert: true};
    const result = await addJobCollection.updateOne(query, updateDocs, options);
    res.send(result);
  });


  try {
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello from job-search-portal Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))
