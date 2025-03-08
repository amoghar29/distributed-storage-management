import express from "express";
import appRouter from "./routes/index";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", appRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
