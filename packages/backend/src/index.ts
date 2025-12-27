import express from "express";
import dotenv from "dotenv";
dotenv.config();
// console.log("INDEX.TS IS RUNNING");
// Import the router after using dotenv.config() unless it won't load env variables
import router from "./routes"

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies 
app.use(router);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
