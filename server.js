import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongodbConnect } from "./config/MongoDbConnect.js";
import routes from "./app/routes/routes.js";

dotenv.config();
MongodbConnect();
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
const port = 8080;

app.get("/api", async (req, res) => { res.send("API Running"); });  
app.use('/api', routes);

app.listen(port, () => {
  console.log("Beckend server is running on port: " + port);
});
