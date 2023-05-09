const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5500;
const app = express();


// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("user management server is running");
})
// nI0P487sqjmPsDjB
const uri = "mongodb+srv://kakon:nI0P487sqjmPsDjB@cluster0.v9m7cjb.mongodb.net/?retryWrites=true&w=majority";
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
        // database name 
        const database = await client.db("usersDB2");
        // Database connection
        const userCollection = database.collection("user");


        // get all users form database
        app.get("/users", async (req, res) =>{
            const cursor = await userCollection.find().toArray();
            res.send(cursor);
        })


        // Insert To database
        app.post("/add", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })



        // Delete A user from the database
        app.delete("/delete/:id", async (req, res) =>{
            const id = req.params.id;
            const query = await { _id: new ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        // find a single user for update page from the database collection
        app.get("/updateUser/:id", async (req, res) => {
            const id = req.params.id;
            const query = await { _id: new ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        // Update user to database
        app.put("/updateUser/:id", async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateUser = {
                $set: {
                    name: updateData.name,
                    email: updateData.email,
                    gender: updateData.gender,
                    status: updateData.status,
                }
            }
            const result = await userCollection.updateOne(filter, updateUser, options);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("usersDB2").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);







// app listen on port 5000
app.listen(port, (req, res) => {
    console.log("Server listening on port : " + port);
});
