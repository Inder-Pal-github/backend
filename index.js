const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const { fileURLToPath } = require("url");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user");
const { authorization } = require("./middlewares/authorization");
const { postRouter } = require("./routes/posts");

/* CONFIGURATIONS */
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

const port = process.env.PORT || 8080;

app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResoursePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.get("/", (req, res) => {
  res.json({ message: "Social Media" });
});
app.use("/api/1.1/users", userRouter);
app.use(authorization);
app.use("/api/1.1/posts", postRouter);
app.listen(port, async () => {
  try {
    await connection;
    console.log(`Listening on http://localhost:${port}`);
  } catch (error) {
    console.log("Not connected!");
  }
});
