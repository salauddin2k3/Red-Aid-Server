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
    const UserInfoCollection = client.db("redAid").collection("userDataCollection");
    const donationRequestCollection = client.db("redAid").collection("donationRequestCollection");
    const blogDataCollection = client.db("redAid").collection("blogCollection");


    // User related API----------------------------------------
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await UserInfoCollection.insertOne(user);
      res.send(result);
    })

    app.get('/users', async (req, res) => {
      const result = await UserInfoCollection.find().toArray();
      res.send(result);
    })

    app.get("/users/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await UserInfoCollection.find({
        email: req.params.email
      }).toArray();
      res.send(result)
    })

    app.put("/users/update/:email", async (req, res) => {
      const query = { email: req.params.email };
      const data = {
        $set: {
          name: req.body.name,
          email: req.body.email,
          district: req.body.district,
          upazilas: req.body.upazilas,
          bloodGroup: req.body.bloodGroup,
          url: req.body.url
        }
      }
      const result = await UserInfoCollection.updateOne(query, data);
      res.send(result)
    })

    // Make Admin
    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'admin'
        }
      }
      // const upsert = {upsert : true}
      const result = await UserInfoCollection.updateOne(filter, updateDoc)
      res.send(result);
    })

    // Make Volunteer
    app.patch('/users/volunteer/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'volunteer'
        }
      }
      // const upsert = {upsert : true}
      const result = await UserInfoCollection.updateOne(filter, updateDoc)
      res.send(result);
    })

    // Make Donor
    app.patch('/users/donor/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'donor'
        }
      }
      // const upsert = {upsert : true}
      const result = await UserInfoCollection.updateOne(filter, updateDoc)
      res.send(result);
    })

    // Active & Block
    app.patch('/users/block/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: 'Block'
        }
      }
      // const upsert = {upsert : true}
      const result = await UserInfoCollection.updateOne(filter, updateDoc)
      res.send(result);
    })

    app.patch('/users/active/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: 'Active'
        }
      }
      // const upsert = {upsert : true}
      const result = await UserInfoCollection.updateOne(filter, updateDoc)
      res.send(result);
    })


    // Donation Request Api----------------------------
    app.post("/donationRequest", async (req, res) => {
      console.log(req.body);
      const result = await donationRequestCollection.insertOne(req.body);
      res.send(result)
    })

    app.get('/allRequest', async (req, res) => {
      const cursor = donationRequestCollection.find().sort({ donationDate: 1 });
      const result = await cursor.toArray();
      res.send(result);
    })

    // All request Sorted
    app.get('/sorted/allRequest', async (req, res) => {
      try {
        const result = await donationRequestCollection.find({ status: "pending" }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send(error.message);
      }
    });

    app.get("/allRequest/:email", async (req, res) => {
      // console.log(req.params.email);
      const result = await donationRequestCollection.find({
        email: req.params.email
      }).sort({ donationDate: 1 }).toArray();
      res.send(result)
    })

    app.get("/singleRequest/:id", async (req, res) => {
      const result = await donationRequestCollection.findOne({
        _id: new ObjectId(req.params.id)
      });
      res.send(result);
    })

    app.put("/updateRequest/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          recipientName: req.body.recipientName,
          district: req.body.district,
          donationDate: req.body.donationDate,
          message: req.body.message,
          hospitalName: req.body.hospitalName,
          upazilas: req.body.upazilas,
          donationTime: req.body.donationTime,
          fullAddress: req.body.fullAddress
        }
      }
      const result = await donationRequestCollection.updateOne(query, data);
      res.send(result)
    })

    app.delete("/delete/:id", async (req, res) => {
      const result = await donationRequestCollection.deleteOne({
        _id: new ObjectId(req.params.id)
      })
      res.send(result);
    })


    // Blog Post Api----------------------------
    app.post("/blogPost", async (req, res) => {
      console.log(req.body);
      const result = await blogDataCollection.insertOne(req.body);
      res.send(result)
    })

        // All blog Sorted
        app.get('/allBlog/sorted', async (req, res) => {
          try {
            const result = await blogDataCollection.find({ status: "published" }).toArray();
            res.send(result);
          } catch (error) {
            res.status(500).send(error.message);
          }
        });

    app.get('/allBLogPost', async (req, res) => {
      const cursor = blogDataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.patch('/status/published/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: 'published'
        }
      }
      // const upsert = {upsert : true}
      const result = await blogDataCollection.updateOne(filter, updateDoc)
      res.send(result);
    })

    app.patch('/status/draft/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: 'draft'
        }
      }
      // const upsert = {upsert : true}
      const result = await blogDataCollection.updateOne(filter, updateDoc)
      res.send(result);
    })

    app.delete("/blog/delete/:id", async (req, res) => {
      const result = await blogDataCollection.deleteOne({
        _id: new ObjectId(req.params.id)
      })
      res.send(result);
    })







    // Make Inprogress
    app.patch('/status/inprogress/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: 'inprogress'
        }
      }
      // const upsert = {upsert : true}
      const result = await donationRequestCollection.updateOne(filter, updateDoc)
      res.send(result);
    })

    // Make Done
    app.patch('/status/done/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: 'done'
        }
      }
      // const upsert = {upsert : true}
      const result = await donationRequestCollection.updateOne(filter, updateDoc)
      res.send(result);
    })

    // Make Cancel
    app.patch('/status/cancel/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: 'cancel'
        }
      }
      // const upsert = {upsert : true}
      const result = await donationRequestCollection.updateOne(filter, updateDoc)
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



