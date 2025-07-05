require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const addRoutes = require("./routes/addRoutes");
const viewRoutes = require("./routes/viewRoutes");
const userRoutes = require("./routes/userRoutes");
const user = require("./models/user");

const app = express();


//Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);


//Connect Database
connectDB();

// //Middleware
app.use(express.json());



// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/add', addRoutes);
app.use("/api/view", viewRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/setting", settingRoutes)



//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port!! ${PORT}`))