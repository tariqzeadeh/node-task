import express from "express";
import cors from "cors";
import { sequelize } from "./dataAccess/database.mjs";
import { config } from "dotenv";
import { postModel } from "./dataAccess/models/postModel.mjs";
import { userModel } from "./dataAccess/models/userModel.mjs";
import { commentModel } from "./dataAccess/models/commentModel.mjs";
import { userRouter, postRouter, commentRouter } from "./routes/index.mjs";
config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.listen(process.env.PORT, async () => {
  console.log("listing to ", process.env.PORT);
  // await userModel.sync({ force: true });
  // await postModel.sync({ force: true });
  // await commentModel.sync({ force: true });
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
