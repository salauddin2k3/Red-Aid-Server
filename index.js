const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c42djsb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const infoCollection = client.db("volunteerStore").collection("volunteerCollection");
    const NewInfoCollection = client.db("volunteerStore").collection("NewBeVolunteerCollection");

    app.post("/addPost", async (req, res) => {
      console.log(req.body);
      const result = await infoCollection.insertOne(req.body);
      res.send(result)
    })

    app.get("/allPost", async (req, res) => {
      const cursor = infoCollection.find().sort({ deadline: 1 });
      const allInfo = await cursor.toArray();
      res.send(allInfo);
    })

    app.get("/singlePost/:id", async (req, res) => {
      const result = await infoCollection.findOne({
        _id: new ObjectId(req.params.id)
      });
      res.send(result);
    })

    app.put("/updatePost/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          postTitle: req.body.postTitle,
          location: req.body.location,
          thumbnail: req.body.thumbnail,
          category: req.body.category,
          volunteersNeeded: req.body.volunteersNeeded,
          deadline: req.body.deadline,
          description: req.body.description
        }
      }
      const result = await infoCollection.updateOne(query, data);
      res.send(result)
    })

    // Test $inc Operation

    app.put("/updateINCPost/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $inc: {
          volunteersNeeded: -1
        }
      }
      const result = await infoCollection.updateOne(query, data);
      res.send(result)
    })

    app.get("/myInfo/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await infoCollection.find({
        email: req.params.email
      }).toArray();
      res.send(result)
    })

    app.delete("/delete/:id", async (req, res) => {
      const result = await infoCollection.deleteOne({
        _id: new ObjectId(req.params.id)
      })
      res.send(result);
    })


    app.get("/singlePost2/:id", async (req, res) => {
      const result = await infoCollection.findOne({
        _id: new ObjectId(req.params.id)
      });
      res.send(result);
    })

    // ------------------------------------------------------------------
    // New Collection: Be a Volunteer

    app.post("/addNewPost", async (req, res) => {
      console.log(req.body);
      const result = await NewInfoCollection.insertOne(req.body);
      res.send(result)
    })

    app.get("/myAnotherInfo/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await NewInfoCollection.find({
        email: req.params.email
      }).toArray();
      res.send(result)
    })

    app.delete("/anotherDelete/:id", async (req, res) => {
      const result = await NewInfoCollection.deleteOne({
        _id: new ObjectId(req.params.id)
      })
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Server Is Running.......');
});

app.listen(port, () => {
  console.log(`Server is Running on Port: ${port}`);
});



