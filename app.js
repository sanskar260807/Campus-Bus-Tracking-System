const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ================== SCHEMAS ==================

const CrowdSchema = new mongoose.Schema({
  level: String
});
const Crowd = mongoose.model("Crowd", CrowdSchema);

const BusSchema = new mongoose.Schema({
  busNo: String,
  routeName: String,
  color: String,
  stops: [{ name: String, lat: Number, lng: Number }]
});
const Bus = mongoose.model("Bus", BusSchema);

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String  // "admin" or "superadmin"
});
const User = mongoose.model("User", UserSchema);

// ================== CROWD ROUTES ==================

// Save crowd level
app.post("/update-crowd", async (req, res) => {
  try {
    const { level } = req.body;
    await Crowd.create({ level });
    res.json({ message: "Saved" });
  } catch (err) {
    res.status(500).json({ error: "Error saving crowd" });
  }
});

// Get latest crowd level
app.get("/get-crowd", async (req, res) => {
  try {
    const data = await Crowd.find().sort({ _id: -1 }).limit(1);
    res.json(data[0] || {});
  } catch (err) {
    res.status(500).json({ error: "DB Error" });
  }
});

// ✅ NEW: Get all crowd records (for admin panel log)
app.get("/get-crowd-all", async (req, res) => {
  try {
    const data = await Crowd.find().sort({ _id: -1 }).limit(50);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "DB Error" });
  }
});

// ================== BUS ROUTES ==================

// Add bus
app.post("/add-bus", async (req, res) => {
  try {
    await Bus.create(req.body);
    res.json({ message: "Bus added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error adding bus" });
  }
});

// Get all buses
app.get("/get-bus", async (req, res) => {
  try {
    const data = await Bus.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching bus data" });
  }
});

// ✅ NEW: Delete a bus by ID (for admin panel)
app.delete("/delete-bus/:id", async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting bus" });
  }
});

// ================== AUTH ==================

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

// ================== START SERVER ==================

async function startServer() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/busDB");
    console.log("✅ MongoDB Connected");
    app.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });
  } catch (err) {
    console.log("❌ Mongo Error:", err);
  }
}

startServer();
