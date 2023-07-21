const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
require("dotenv").config();
const jwt = require("jsonwebtoken");
app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kp7ovze.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const verifyToken = async (req, res, next) => {
  const authorization = req.query?.authorization;
  if (!authorization) {
    return res.send({ error: true, message: "Unauthorized Access" });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.send({ error: true, message: "Invalid token" });
  }
  jwt.verify(token, process.env.JWT_TOKEN, function (err, decoded) {
    if (err) {
      return res.send({ error: true, message: err.message });
    }
    req.decoded = decoded;
    next();
  });
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("Task-Align").collection("Users");

    // -----GET---------GET----------GET---------GET----------GET

    // Getting user details
    app.get("/user/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const userInfo = req.decoded.user;
      if (userInfo.user === email) {
        const user = await userCollection.findOne(query);
        res.send(user);
        return;
      }else {
        res.send({error: true, message: "Access denied"});
      }
    });

    // -----POST--------POST---------POST--------POST---------POST
    // Create token for User
    app.post("/get-token", (req, res) => {
      const user = req.body;
      const token = jwt.sign({ user }, process.env.JWT_TOKEN, {
        expiresIn: "1h",
      });
      res.send({ token: token });
    });

    // -----PUT---------PUT----------PUT---------PUT----------PUT
    // Saving user to Database
    app.put("/save-user/:email", async (req, res) => {
      const email = req.params.email;
      const details = req.body;
      const query = { email: email };
      const doc = {
        $set: { ...details },
      };
      const options = { upsert: true };
      const result = await userCollection.updateOne(query, doc, options);
      res.send(result);
    });

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

app.get("/", (req, res) => {
  res.send("Welcome To Task Align Server");
});

app.listen(port, () => {
  console.log("Sever is running on port 3000");
});
