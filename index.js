const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const port = 3001;
const scrapper = require("./scrapper");

app.get("/api/deprem", async (req, res) => {
  const response = await scrapper();
  res.send(response);
});

app.listen(port, () => console.log(`Server started on port ${port}`));
