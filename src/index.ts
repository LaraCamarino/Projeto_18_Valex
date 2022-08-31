import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


const PORT: number = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log("Server running on port " + process.env.PORT));