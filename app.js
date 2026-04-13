const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Schema
const CrowdSchema = new mongoose.Schema({
  level: String
});

const Crowd = mongoose.model("Crowd", CrowdSchema);

// API: Save crowd
app.post("/update-crowd", async (req, res) => {
  try {
    const { level } = req.body;
    await Crowd.create({ level });
    res.json({ message: "Saved" });
  } catch (err) {
    res.status(500).json({ error: "Error saving" });
  }
});

// API: Get latest crowd
app.get("/get-crowd", async (req, res) => {
  try {
    const data = await Crowd.find().sort({ _id: -1 }).limit(1);
    res.json(data[0] || {});
  } catch (err) {
    res.status(500).json({ error: "DB Error" });
  }
});

// ⭐ CONNECT DB FIRST, THEN START SERVER
async function startServer() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/busDB");
    console.log("MongoDB Connected");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });

  } catch (err) {
    console.log("Mongo Error:", err);
  }
}

startServer();