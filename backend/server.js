const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const port = 5010;

const uri = process.env.MONGODB_URI

// connect to mongo db

async function connectDB(){
    const client = new MongoClient(uri);
    await client.connect();
    return client.db("Sustainability").collection("snhudata");
}

//API endpoint to fetch all credits

app.get('/api/credits',async (req, res)=>{
    try {
        const collection = await connectDB();
        const credits = await collection.find({}).toArray();
        res.json(credits);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.listen(port, ()=>{
    console.log("Server is running");
});

const { exec } = require('child_process');
const { stdout, stdin, stderr } = require('process');

app.get('/api/predict', (req, res) => {
    exec('source ../snhuai/env/bin/activate && python3 ../snhuai/predict.py', (error, stdout, stderr) => {
      if (error) {
        console.error('Error:', stderr);
        return res.status(500).json({ error: stderr });
      }
      const prediction = parseFloat(stdout.trim()); // Trim whitespace and parse as float
      if (isNaN(prediction)) {
        return res.status(500).json({ error: 'Invalid prediction value' });
      }
      res.json({ prediction });
    });
  });