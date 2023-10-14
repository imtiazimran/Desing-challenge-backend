const express = require("express")
const app = express()
const cors = require("cors")
const port = process.env.PORT || 5000
require("dotenv").config()
const { MongoClient, ServerApiVersion } = require('mongodb');


// middlewere
app.use(cors())
app.use(express.json())




const uri = `${process.env.MONGO_ACCESS}`;

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

        const DB = client.db('DATA_FROM_MOHIT')
        const CharterAcountedData = DB.collection("CharterAcountent")

        app.get("/acountent", async (req, res) => {
            const result = await CharterAcountedData.find().toArray()
            res.send(result)
        })

        app.get("/search", async (req, res) => {
            // Get the search query from the request query parameters
            const query = req.query.query; 
            // Perform a search in MongoDB collection based on the query
            const result = await CharterAcountedData.find({ name: { $regex: query, $options: 'i' } }).toArray();
            console.log(query, result);
            res.send(result);
        });


        app.post('/acountent', async (req, res) => {
            const newData = req.body;
            const result = await CharterAcountedData.insertOne(newData)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Design-challege Accepted")
})

app.listen(port, () => {
    console.log(`Mohite Consultancy is Running On: ${port}`)
})