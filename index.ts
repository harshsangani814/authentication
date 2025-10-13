import "dotenv/config";
import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./ormconfig";
import authRoutes from "./routes/auth.routes";


const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => console.log("Server on", PORT));
  })
  .catch((err: any) => {
    console.error("DB init error", err);
  });
