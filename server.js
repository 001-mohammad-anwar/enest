import { config } from "dotenv";
config();
import { connectDb } from "./config/db.js";
import app from "./app.js";
connectDb();
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
