const express = require('express')
const { MongoClient, ServerApiVersion, AuthMechanism } = require('mongodb');
const cors = require('cors');
const { ObjectID } = require('bson');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// user name: assertData
// password: FXsI6o1dqfRikjXm

const uri = "mongodb+srv://assertData:FXsI6o1dqfRikjXm@cluster0.ijybm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const dataCollection = client.db('data').collection('user');

        // data for set mongodb 
        app.post('/user', async (req, res) => {
            const list = req.body;
            const result = await dataCollection.insertOne(list);
            res.send(result);
        })

        // data for show 
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = dataCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);

        })

        // data for delete 
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const result = await dataCollection.deleteOne(query);
            res.send(result);
        })

        // update data 
        app.put('/user/:id', async (req, res) => {
            const update = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectID(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: update.name,
                    email: update.email
                }
            }
            const result = await dataCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // data get one each for code 
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const result = await dataCollection.findOne(query);
            res.send(result);
        })
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('curd operation is running')
})

app.listen(port, () => {
    console.log('connected')
})