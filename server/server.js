import express from "express";
import mongoose from "mongoose";
const app = express();
import dotenv from "dotenv";
import dcript from "bcryptjs";
import User from "./Schema/User.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./Schema/authMiddleware.js";
dotenv.config();
let PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB Successfully");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Hello from Blogging App Server");
});
app.post("/api/v1/auth/signup", async (req, res) => {

    // Registration logic here
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (fullname.length < 3) {
        return res.status(400).json({ message: "fullname must be at least 3 characters long" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    const hashPassword = dcript.hashSync(password, 10);
    if (!hashPassword) {
        return res.status(500).json({ message: "Error hashing password" });
    }
    const emainlExists = await User.findOne({ "personal_info.email": email });
    if (emainlExists) {
        return res.status(400).json({ message: "Email already in use" });
    }

    const username = email.split("@")[0] + Math.floor(Math.random() * 1000);
    let user = new User({
        personal_info: { fullname, email, password: hashPassword, username },
    });
    user.save().then(() => {
        return res.status(201).json({ message: "User registered successfully", user });
    }).catch((err) => {
        console.error("Error saving user:", err);
        return res.status(500).json({ message: "Error registering user" });
    });
});
app.post("/api/v1/auth/login", async (req, res) => {
    // Login logic here
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ "personal_info.email": email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = dcript.compareSync(password, user.personal_info.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000 // 1 hour
    });
    return res.status(200).json({ message: "Login successful", token, user });

});
app.get("/api/v1/auth/profile", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.userId).select("-personal_info.password");
    res.status(200).json({ user });
});

app.get("/api/v1/auth/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

    return res.status(200).json({ message: "Logout successful" });
});




// Define your routes here
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

