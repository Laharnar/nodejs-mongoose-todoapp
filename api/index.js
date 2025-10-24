const express = require("express");
const mongoose = require("mongoose");
const Todo = require("../models/todoList"); // adjust if needed

const app = express();
app.use(express.json());

let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Missing MONGODB_URI env var");
    const db = await mongoose.connect(uri);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected");
}

app.get("/api/test-db", async (req, res) => {
    try {
        await connectDB();
        res.json({ connected: true });
    } catch (err) {
        res.status(500).json({ connected: false, error: err.message });
    }
});

app.get("/api/todos", async (req, res) => {
    await connectDB();
    const todos = await Todo.find({});
    res.json(todos);
});

module.exports = app;