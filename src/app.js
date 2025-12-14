import express from "express";

const app = express();

app.use((req, res) => {
  console.log(`${req.originalUrl}`);
  return res.send("This is how we roll");
});

app.listen(4009, () => {
  console.log("App running on port 4009");
});
