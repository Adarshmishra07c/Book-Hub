import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB: BookHub"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// --- SCHEMAS & MODELS ---
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Hash password before saving
// Note: We use a standard function (not arrow) to keep 'this' context
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw new Error("Password hashing failed");
  }
});

const User = mongoose.model("User", userSchema);

const bookSchema = new mongoose.Schema(
  {
    title: String, author: String, genre: String, price: Number,
    rating: Number, reviews: Number, cover: String, badge: String,
    pages: Number, publisher: String, language: String, description: String
  },
  { collection: "books" }
);
const Book = mongoose.model("Book", bookSchema);

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  items: { type: Array, default: [] }
});
const Cart = mongoose.model("Cart", cartSchema);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    items: [String],
    totalPrice: { type: Number, required: true },
    shippingDetails: { 
        firstName: String, lastName: String, email: String, 
        address: String, city: String, zip: String, country: String 
    }
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", orderSchema, "orders");

// --- ROUTES ---

// 1. REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation: Ensure all fields are present
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = new User({ username, email, password });
    await user.save();
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Registration failed: " + err.message });
  }
});

// 2. REGULAR LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });

    // SPECIFIC CHECK: If user doesn't exist in DB
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Password Match Logic (Handles both hashed and legacy plain text)
    let isMatch = false;
    const isAlreadyHashed = typeof user.password === "string" && user.password.startsWith("$2");

    if (isAlreadyHashed) {
      isMatch = await bcrypt.compare(password, user.password);
    } else if (user.password === password) {
      // Automatic migration: Hash the plain text password for future use
      isMatch = true;
      user.password = password; 
      user.markModified("password");
      await user.save();
    }

    // If password doesn't match
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Success - Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ 
      id: user._id, 
      username: user.username, 
      email: user.email, 
      isAdmin: user.isAdmin, 
      token 
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 3. SECRET ADMIN ENTRANCE ROUTE
app.post("/api/admin-login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email, isAdmin: true });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { id: user._id, username: user.username, isAdmin: true },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        res.json({ id: user._id, username: user.username, email: user.email, isAdmin: true, token });
      } else {
        res.status(403).json({ message: "Access Denied: Admin credentials required." });
      }
    } catch (err) {
      res.status(500).json({ message: "Admin Login Error" });
    }
  });

// 4. BOOKS (GET, POST, DELETE)
app.get("/api/books", async (req, res) => {
  try { res.json(await Book.find()); } 
  catch (err) { res.status(500).json({ message: "Error fetching books" }); }
});

app.post("/api/books", async (req, res) => {
    try {
      const newBook = new Book(req.body);
      await newBook.save();
      res.status(201).json(newBook);
    } catch (err) {
      res.status(500).json({ message: "Error adding book" });
    }
});

app.delete("/api/books/:id", async (req, res) => {
    try {
      await Book.findByIdAndDelete(req.params.id);
      res.json({ message: "Book Deleted Successfully" });
    } catch (err) {
      res.status(500).json({ message: "Delete failed" });
    }
});

// 5. CART & ORDERS
app.post("/api/cart", async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { upsert: true, new: true }
    );
    res.json(cart);
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.get("/api/cart/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart ? cart.items : []);
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.get("/api/orders", async (req, res) => {
    try { res.json(await Order.find()); } 
    catch (err) { res.status(500).json({ message: "Error fetching orders" }); }
});

app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    await Cart.findOneAndDelete({ userId: req.body.userId });
    res.status(201).json({ message: "Order placed" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));