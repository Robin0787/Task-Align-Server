const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
require('dotenv').config();

app.use(cors());

app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kp7ovze.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db('Task-Align').collection('Users');

    // -----GET---------GET----------GET---------GET----------GET
    

    // -----POST--------POST---------POST--------POST---------POST


    // -----PUT---------PUT----------PUT---------PUT----------PUT
    app.put('/save-user/:email', async (req, res) => {
        const email = req.params.email;
        const details = req.body;
        const query = {email: email};
        const doc = {
            $set: {...details}
        }
        const options = {upsert: true};
        const result = await userCollection.updateOne(query, doc, options);
        res.send(result);
    })

    // -----PATCH-------PATCH--------PATCH-------PATCH--------PATCH


    // -----DELETE------DELETE-------DELETE------DELETE-------DELETE

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome To Task Align Server');
})

app.listen(port, () => {
    console.log('Sever is running on port 3000');
})
