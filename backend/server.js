require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const complaintRoutes = require("./routes/complaintRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Circus of Wonders — Grounds Manager API",
    status: "Server is running!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/users", userRoutes);
const PORT = process.env.PORT || 5000;
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}/api`);
});
